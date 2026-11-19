-- =====================================================================
-- 05_programacion.sql — Motor transaccional (evidencia CE0223)
-- Funciones, procedimiento almacenado y triggers sobre el esquema real.
-- Probado en postgres:15-alpine. Propuesto para migrarse con Alembic.
-- =====================================================================

-- 1. Tabla de auditoría de pagos (registra quién cambió qué y cuándo) ------
CREATE TABLE auditoria_pagos (
    id           BIGSERIAL PRIMARY KEY,
    pago_id      INTEGER,
    operacion    CHAR(1)      NOT NULL CHECK (operacion IN ('I','U','D')),
    usuario_bd   TEXT         NOT NULL DEFAULT current_user,
    datos_antes  JSONB,
    datos_despues JSONB,
    ocurrido_en  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION fn_auditar_pagos() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria_pagos (pago_id, operacion, datos_despues)
        VALUES (NEW.id, 'I', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria_pagos (pago_id, operacion, datos_antes, datos_despues)
        VALUES (NEW.id, 'U', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSE
        INSERT INTO auditoria_pagos (pago_id, operacion, datos_antes)
        VALUES (OLD.id, 'D', to_jsonb(OLD));
        RETURN OLD;
    END IF;
END $$;

CREATE TRIGGER trg_auditoria_pagos
AFTER INSERT OR UPDATE OR DELETE ON pagos
FOR EACH ROW EXECUTE FUNCTION fn_auditar_pagos();

-- 2. Regla de planta: un borne dañado no puede tener cliente, y uno con
--    cliente queda "ocupado" automáticamente --------------------------------
CREATE OR REPLACE FUNCTION fn_validar_borne() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.cliente_id IS NOT NULL AND NEW.estado = 'danado' THEN
        RAISE EXCEPTION 'El borne % de la caja % está dañado: no se puede asignar a un cliente',
            NEW.numero, NEW.caja_nap_id;
    END IF;
    IF NEW.cliente_id IS NOT NULL THEN
        NEW.estado := 'ocupado';
    ELSIF NEW.estado = 'ocupado' THEN
        NEW.estado := 'libre';
    END IF;
    RETURN NEW;
END $$;

CREATE TRIGGER trg_validar_borne
BEFORE INSERT OR UPDATE ON bornes
FOR EACH ROW EXECUTE FUNCTION fn_validar_borne();

-- 3. Función: días de mora de un cliente a una fecha ------------------------
CREATE OR REPLACE FUNCTION fn_dias_mora(p_cliente INTEGER, p_fecha DATE DEFAULT current_date)
RETURNS INTEGER LANGUAGE sql STABLE AS $$
    SELECT GREATEST(0, p_fecha - fecha_vencimiento)
    FROM clientes WHERE id = p_cliente;
$$;

-- 4. Procedimiento: registrar un pago de forma atómica ----------------------
--    valida, inserta el pago y, si el cliente estaba suspendido, lo reactiva
--    y deja constancia en el historial. Todo o nada.
CREATE OR REPLACE PROCEDURE sp_registrar_pago(
    p_cliente   INTEGER,
    p_monto     DOUBLE PRECISION,
    p_mes       VARCHAR(7),
    p_metodo    VARCHAR(50),
    p_operacion VARCHAR(100),
    p_usuario   INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    v_estado estadocliente;
BEGIN
    IF p_monto IS NULL OR p_monto <= 0 THEN
        RAISE EXCEPTION 'Monto inválido: %', p_monto;
    END IF;
    IF p_mes !~ '^[0-9]{4}-(0[1-9]|1[0-2])$' THEN
        RAISE EXCEPTION 'Mes inválido (formato AAAA-MM): %', p_mes;
    END IF;

    SELECT estado INTO v_estado FROM clientes WHERE id = p_cliente FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cliente % no existe', p_cliente;
    END IF;

    INSERT INTO pagos (cliente_id, monto, mes_pagado, fecha_pago, metodo_pago,
                       numero_operacion, estado, registrado_por)
    VALUES (p_cliente, p_monto, p_mes, current_date, p_metodo,
            p_operacion, 'pagado', p_usuario);

    IF v_estado = 'suspendido' THEN
        UPDATE clientes
           SET estado = 'activo',
               fecha_vencimiento = current_date + 30,
               fecha_ultima_activacion = current_date
         WHERE id = p_cliente;
        INSERT INTO historial (cliente_id, tipo, descripcion, usuario_id)
        VALUES (p_cliente, 'activacion', 'Reactivación automática por pago ' || p_mes, p_usuario);
    END IF;
END $$;

-- 5. Índices propuestos tras el análisis de planes de ejecución -------------
-- (se crean en 05b después de medir el plan sin índice)
