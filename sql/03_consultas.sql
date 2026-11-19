\echo '--- Q1: clientes con servicio vencido (candidatos a corte)'
SELECT c.id, c.nombre, z.nombre AS zona, p.codigo AS plan, c.fecha_vencimiento,
       (DATE '2026-11-18' - c.fecha_vencimiento) AS dias_mora
FROM clientes c JOIN zonas z ON z.id = c.zona_id JOIN planes p ON p.id = c.plan_id
WHERE c.estado IN ('activo','suspendido') AND c.fecha_vencimiento < DATE '2026-11-18'
ORDER BY dias_mora DESC;

\echo '--- Q2: ocupación de bornes por caja NAP'
SELECT n.codigo, COUNT(*) FILTER (WHERE b.estado='libre') AS libres,
       COUNT(*) FILTER (WHERE b.estado='ocupado') AS ocupados,
       COUNT(*) FILTER (WHERE b.estado='danado') AS danados
FROM cajas_nap n JOIN bornes b ON b.caja_nap_id = n.id GROUP BY n.codigo ORDER BY n.codigo;

\echo '--- Q3: ingresos vs gastos por mes'
SELECT m.mes, COALESCE(i.ingresos,0) AS ingresos, COALESCE(g.gastos,0) AS gastos,
       COALESCE(i.ingresos,0) - COALESCE(g.gastos,0) AS utilidad
FROM (SELECT DISTINCT mes_pagado AS mes FROM pagos UNION SELECT to_char(fecha,'YYYY-MM') FROM gastos) m
LEFT JOIN (SELECT mes_pagado AS mes, SUM(monto) AS ingresos FROM pagos WHERE estado='pagado' GROUP BY 1) i USING (mes)
LEFT JOIN (SELECT to_char(fecha,'YYYY-MM') AS mes, SUM(monto) AS gastos FROM gastos GROUP BY 1) g USING (mes)
ORDER BY m.mes;

\echo '--- Q4: clientes por zona y estado'
SELECT z.nombre AS zona, c.estado, COUNT(*) FROM clientes c JOIN zonas z ON z.id=c.zona_id
GROUP BY z.nombre, c.estado ORDER BY z.nombre, c.estado;

\echo '--- Q5: regla RN-06, número de operación duplicado (debe fallar)'
INSERT INTO pagos (cliente_id, monto, mes_pagado, fecha_pago, numero_operacion) VALUES (1, 49.0, '2026-11', '2026-11-18', 'OP-0001');

\echo '--- Q6: mismo número de borne dos veces en una caja (debe fallar)'
INSERT INTO bornes (caja_nap_id, numero, estado) VALUES (1, 1, 'libre');

\echo '--- Q7: zonas sin túnel WireGuard configurado'
SELECT nombre FROM zonas WHERE ip_wireguard IS NULL;

\echo '--- Q8: inventario de ONU por técnico y estado'
SELECT u.nombre AS tecnico, o.estado, COUNT(*) FROM onus o JOIN usuarios u ON u.id=o.tecnico_id GROUP BY 1,2 ORDER BY 1,2;
