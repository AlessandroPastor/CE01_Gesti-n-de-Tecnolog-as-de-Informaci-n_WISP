-- =====================================================================
-- 07_pruebas_programacion.sql — Pruebas del motor transaccional y de los roles
-- =====================================================================
\echo '--- P1: días de mora del cliente 2 (suspendido) al 18/11/2026'
SELECT fn_dias_mora(2, DATE '2026-11-18') AS dias_mora;

\echo '--- P2: sp_registrar_pago reactiva al cliente suspendido y audita'
CALL sp_registrar_pago(2, 39.0, '2026-11', 'yape', 'OP-0100', 4);
SELECT id, estado, fecha_vencimiento > DATE '2026-11-18' AS vencimiento_extendido FROM clientes WHERE id = 2;
SELECT tipo, descripcion FROM historial WHERE cliente_id = 2 ORDER BY id DESC LIMIT 1;
SELECT pago_id, operacion, usuario_bd, datos_despues->>'numero_operacion' AS operacion_bancaria
FROM auditoria_pagos ORDER BY id DESC LIMIT 1;

\echo '--- P3: mes con formato inválido (debe fallar y no dejar nada a medias)'
CALL sp_registrar_pago(1, 49.0, '11-2026', 'yape', 'OP-0101', 4);
SELECT COUNT(*) AS pagos_con_OP_0101 FROM pagos WHERE numero_operacion = 'OP-0101';

\echo '--- P4: asignar un cliente a un borne dañado (debe fallar)'
UPDATE bornes SET cliente_id = 3 WHERE caja_nap_id = 1 AND numero = 8;

\echo '--- P5: asignar cliente a borne libre: el trigger lo marca ocupado'
UPDATE bornes SET cliente_id = 3 WHERE caja_nap_id = 2 AND numero = 1;
SELECT numero, estado, cliente_id FROM bornes WHERE caja_nap_id = 2 AND numero = 1;

\echo '--- P6: rol de reportes ve la vista, pero no las credenciales PPPoE'
SET ROLE wisp_lectura;
SELECT id, nombre, zona, estado FROM v_clientes_reporte ORDER BY id LIMIT 3;
SELECT password_pppoe FROM clientes LIMIT 1;
RESET ROLE;

\echo '--- P7: la aplicación no puede borrar la auditoría'
SET ROLE wisp_app;
DELETE FROM auditoria_pagos;
RESET ROLE;
