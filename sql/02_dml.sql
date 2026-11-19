-- Datos de prueba ANONIMIZADOS (no corresponden a clientes reales)
INSERT INTO usuarios (nombre, email, hashed_password, rol, activo) VALUES
 ('Administrador General', 'admin',          '$2b$12$hash.demo.admin', 'admin', true),
 ('Técnico Zona Norte',    'tecnico1',       '$2b$12$hash.demo.tec1',  'tecnico', true),
 ('Vendedora Campo 1',     'vendedora1',     '$2b$12$hash.demo.ven1',  'vendedor_campo', true),
 ('Atención Oficina',      'atencion1',      '$2b$12$hash.demo.ate1',  'atencion_cliente', true);

INSERT INTO zonas (nombre, ip_lan, ip_wireguard, pool_pppoe, lista_corte, activo) VALUES
 ('SUCASCO', '192.168.20.1', '10.10.0.101', 'PPPOE', 'CORTE MOROSO', true),
 ('HUATA',   '192.168.2.1',  '10.10.0.102', 'pppoe-pool', 'CORTE MOROSO', true),
 ('VILQUE',  '192.168.33.1', NULL, NULL, NULL, true);

INSERT INTO tecnico_zona (tecnico_id, zona_id) VALUES (2,1), (2,2);

INSERT INTO planes (codigo, nombre, bajada_mbps, subida_mbps, precio, incluye_tv, tv_incluidas, tipo_conexion, activo) VALUES
 ('PLAN01','Plan 50 Mbps', 50, 10, 39.0, false, 0, 'fibra_optica', true),
 ('PLAN02','Plan 100 Mbps',100, 15, 49.0, false, 0, 'fibra_optica', true),
 ('PLAN03','Plan 150 Mbps + TV',150, 20, 69.0, true, 1, 'fibra_optica', true),
 ('PLAN04','Plan 200 Mbps + TV',200, 30, 79.0, true, 1, 'fibra_optica', true);

INSERT INTO mufas (codigo, zona_id, activo) VALUES ('MUF-SUC-01', 1, true);
INSERT INTO cajas_nap (codigo, zona_id, mufa_id, capacidad_bornes, activo) VALUES
 ('NAP-SUC-01', 1, 1, 8, true), ('NAP-SUC-02', 1, 1, 8, true);
INSERT INTO bornes (caja_nap_id, numero, estado)
 SELECT c.id, g, 'libre' FROM cajas_nap c, generate_series(1,8) g;

INSERT INTO clientes (nombre, tipo_documento, dni, telefono_whatsapp, usuario_pppoe, password_pppoe,
  zona_id, plan_id, fecha_instalacion, fecha_vencimiento, estado, tipo_conexion, vendedor_id, aprobado_por_id, tecnico_instalador_id, migrado, cantidad_tv)
VALUES
 ('Cliente Demo Uno',    'dni','10000001','900000001','10000001','demo', 1, 2, '2026-06-25','2026-11-23','activo','fibra_optica',3,1,2,false,0),
 ('Cliente Demo Dos',    'dni','10000002','900000002','10000002','demo', 1, 1, '2026-06-25','2026-10-23','suspendido','fibra_optica',3,1,2,false,0),
 ('Cliente Demo Tres',   'dni','10000003','900000003','10000003','demo', 1, 3, '2026-07-10','2026-11-25','activo','fibra_optica',3,1,2,true,1),
 ('Cliente Demo Cuatro', 'dni','10000004','900000004','10000004','demo', 2, 4, NULL, NULL,'pendiente_aprobacion','fibra_optica',3,NULL,NULL,false,1);

UPDATE bornes SET estado='ocupado', cliente_id=1 WHERE caja_nap_id=1 AND numero=1;
UPDATE bornes SET estado='ocupado', cliente_id=2 WHERE caja_nap_id=1 AND numero=2;
UPDATE bornes SET estado='danado' WHERE caja_nap_id=1 AND numero=8;

INSERT INTO onus (numero_serie, mac, marca, wifi_version, estado, tecnico_id, cliente_id) VALUES
 ('SN-DEMO-0001','AA:BB:CC:00:00:01','Askey','wifi6','instalado',2,1),
 ('SN-DEMO-0002','AA:BB:CC:00:00:02','Mitrastar','wifi5','instalado',2,2),
 ('SN-DEMO-0003','AA:BB:CC:00:00:03','Askey','wifi6','asignado_tecnico',2,NULL);

INSERT INTO pagos (cliente_id, monto, mes_pagado, fecha_pago, metodo_pago, numero_operacion, estado, registrado_por) VALUES
 (1, 49.0, '2026-09', '2026-09-22', 'yape', 'OP-0001', 'pagado', 4),
 (1, 49.0, '2026-10', '2026-10-21', 'yape', 'OP-0002', 'pagado', 4),
 (2, 39.0, '2026-09', '2026-09-24', 'efectivo', NULL, 'pagado', 4),
 (3, 69.0, '2026-10', '2026-10-25', 'transferencia', 'OP-0003', 'pagado', 4);

INSERT INTO historial (cliente_id, tipo, descripcion, usuario_id) VALUES
 (2, 'corte', 'Corte por falta de pago (mes 2026-10)', 1);

INSERT INTO gastos (descripcion, monto, categoria, fecha, zona_id, registrado_por) VALUES
 ('Internet mayorista zona SUCASCO', 350.0, 'Proveedor', '2026-10-05', 1, 1);
