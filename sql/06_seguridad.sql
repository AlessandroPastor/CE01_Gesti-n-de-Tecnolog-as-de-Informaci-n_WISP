-- =====================================================================
-- 06_seguridad.sql — Usuarios, roles y mínimo privilegio (evidencia CE0224)
-- Las contraseñas de este script son de laboratorio; en producción se
-- definen fuera del repositorio (gestor de secretos / .env no versionado).
-- =====================================================================

-- Nadie usa el esquema público por defecto
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Rol dueño de los objetos (sin login): las migraciones corren con él
CREATE ROLE wisp_owner NOLOGIN;

-- Rol de la aplicación (backend FastAPI): solo DML y ejecución
CREATE ROLE wisp_app LOGIN PASSWORD 'lab-app-solo-pruebas' CONNECTION LIMIT 30;
GRANT USAGE ON SCHEMA public TO wisp_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wisp_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO wisp_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO wisp_app;
GRANT EXECUTE ON PROCEDURE sp_registrar_pago TO wisp_app;
-- la auditoría no se puede borrar ni modificar desde la aplicación
REVOKE UPDATE, DELETE ON auditoria_pagos FROM wisp_app;

-- Rol de reportes (gerencia, BI): solo vistas sin credenciales
CREATE ROLE wisp_lectura LOGIN PASSWORD 'lab-lectura-solo-pruebas' CONNECTION LIMIT 5;
GRANT USAGE ON SCHEMA public TO wisp_lectura;
CREATE VIEW v_clientes_reporte AS
    SELECT c.id, c.nombre, z.nombre AS zona, p.codigo AS plan, c.estado,
           c.fecha_instalacion, c.fecha_vencimiento
    FROM clientes c
    LEFT JOIN zonas z ON z.id = c.zona_id
    JOIN planes p ON p.id = c.plan_id;
CREATE VIEW v_ingresos_mes AS
    SELECT mes_pagado AS mes, COUNT(*) AS pagos, SUM(monto) AS ingresos
    FROM pagos WHERE estado = 'pagado' GROUP BY mes_pagado;
GRANT SELECT ON v_clientes_reporte, v_ingresos_mes TO wisp_lectura;

-- Rol de respaldo: lectura total, sin escritura (rol predefinido de PG 14+)
CREATE ROLE wisp_respaldo LOGIN PASSWORD 'lab-respaldo-solo-pruebas';
GRANT pg_read_all_data TO wisp_respaldo;
