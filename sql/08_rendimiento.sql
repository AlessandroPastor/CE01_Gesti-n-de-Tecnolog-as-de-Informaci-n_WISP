-- =====================================================================
-- 08_rendimiento.sql — Planes de ejecución antes y después de indexar
-- Carga sintética: 50 000 clientes y 600 000 pagos (volumen muy superior
-- al real, para que la diferencia sea medible).
-- =====================================================================
ALTER TABLE pagos DISABLE TRIGGER trg_auditoria_pagos;

INSERT INTO clientes (nombre, tipo_documento, dni, usuario_pppoe, password_pppoe, zona_id, plan_id,
                      fecha_instalacion, fecha_vencimiento, estado, tipo_conexion, migrado, cantidad_tv)
SELECT 'Cliente sintético ' || g, 'dni', lpad((20000000 + g)::text, 8, '0'), 'u' || g, 'x',
       1 + (g % 2), 1 + (g % 4), DATE '2025-01-01' + (g % 600),
       DATE '2026-12-31' - (g % 120), (CASE WHEN g % 10 = 0 THEN 'suspendido' ELSE 'activo' END)::estadocliente,
       'fibra_optica', false, 0
FROM generate_series(1, 50000) g;

INSERT INTO pagos (cliente_id, monto, mes_pagado, fecha_pago, metodo_pago, estado)
SELECT c.id, 49.0, to_char(DATE '2026-01-01' + (m || ' month')::interval, 'YYYY-MM'),
       DATE '2026-01-05' + (m || ' month')::interval, 'efectivo', 'pagado'
FROM clientes c CROSS JOIN generate_series(0, 11) m
WHERE c.nombre LIKE 'Cliente sintético%';

ALTER TABLE pagos ENABLE TRIGGER trg_auditoria_pagos;
ANALYZE;

\echo '=== R1 SIN índice: historial de pagos de un cliente (ficha del cliente)'
EXPLAIN (ANALYZE, COSTS OFF, SUMMARY ON)
SELECT mes_pagado, monto FROM pagos WHERE cliente_id = 30000 ORDER BY fecha_pago DESC;

\echo '=== R2 SIN índice: candidatos a corte automático (job de las 09:00)'
EXPLAIN (ANALYZE, COSTS OFF, SUMMARY ON)
SELECT id FROM clientes
WHERE estado = 'activo' AND fecha_vencimiento <= DATE '2026-09-05';

CREATE INDEX ix_pagos_cliente_fecha ON pagos (cliente_id, fecha_pago DESC);
CREATE INDEX ix_clientes_estado_venc ON clientes (estado, fecha_vencimiento);
ANALYZE;

\echo '=== R1 CON índice ix_pagos_cliente_fecha'
EXPLAIN (ANALYZE, COSTS OFF, SUMMARY ON)
SELECT mes_pagado, monto FROM pagos WHERE cliente_id = 30000 ORDER BY fecha_pago DESC;

\echo '=== R2 CON índice ix_clientes_estado_venc'
EXPLAIN (ANALYZE, COSTS OFF, SUMMARY ON)
SELECT id FROM clientes
WHERE estado = 'activo' AND fecha_vencimiento <= DATE '2026-09-05';
