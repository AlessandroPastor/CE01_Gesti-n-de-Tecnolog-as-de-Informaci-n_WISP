-- =====================================================================
-- DDL del sistema WISP (PostgreSQL 15)
-- Generado desde backend/app/models.py (rama main, 18/11/2026) con el
-- dialecto PostgreSQL de SQLAlchemy 2.0.30. Equivale al estado head de
-- las 32 migraciones Alembic. Probado en postgres:15-alpine.
-- =====================================================================

CREATE TYPE rolusuario AS ENUM ('admin', 'tecnico', 'vendedor_campo', 'atencion_cliente');

CREATE TYPE estadocliente AS ENUM ('pendiente_aprobacion', 'rechazado', 'aprobado', 'no_instalado', 'activo', 'anulado', 'suspendido', 'pausado');

CREATE TYPE estadopago AS ENUM ('pagado', 'pendiente', 'vencido', 'corte_temporal');

CREATE TYPE tipohistorial AS ENUM ('activacion', 'corte', 'pago', 'cambio_plan', 'cambio_onu', 'compromiso_pago', 'nota');

CREATE TYPE tipodocumento AS ENUM ('dni', 'ruc');

CREATE TYPE tipoconexion AS ENUM ('inalambrico', 'fibra_optica', 'satelital');

CREATE TYPE estadoequipo AS ENUM ('prestado', 'comprado', 'sin_equipo');

CREATE TYPE estadoborne AS ENUM ('libre', 'ocupado', 'danado');

CREATE TYPE estadoonu AS ENUM ('en_almacen', 'asignado_tecnico', 'instalado', 'danado', 'perdido');

CREATE TYPE wifiversion AS ENUM ('wifi5', 'wifi6');

CREATE TYPE estadoordenretiro AS ENUM ('pendiente', 'completado');

CREATE TYPE estadoaveria AS ENUM ('pendiente', 'asignada', 'en_proceso', 'resuelta');

CREATE TYPE tipoevidencia AS ENUM ('instalacion', 'averia', 'retiro', 'otro');

CREATE TYPE estadomensajemasivo AS ENUM ('en_progreso', 'completado', 'cancelado');

CREATE TYPE estadoenviomasivo AS ENUM ('pendiente', 'enviado', 'fallido');

CREATE TYPE estadojornada AS ENUM ('activa', 'finalizada');

CREATE TABLE consultas_documento_mes (
	id SERIAL NOT NULL, 
	anio INTEGER NOT NULL, 
	mes INTEGER NOT NULL, 
	cantidad INTEGER NOT NULL, 
	actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	CONSTRAINT uq_consulta_mes UNIQUE (anio, mes)
);

CREATE INDEX ix_consultas_documento_mes_id ON consultas_documento_mes (id);

CREATE TABLE planes (
	id SERIAL NOT NULL, 
	codigo VARCHAR(20) NOT NULL, 
	nombre VARCHAR(100) NOT NULL, 
	bajada_mbps INTEGER NOT NULL, 
	subida_mbps INTEGER NOT NULL, 
	precio FLOAT NOT NULL, 
	incluye_tv BOOLEAN NOT NULL, 
	tv_incluidas INTEGER NOT NULL, 
	precio_tv_adicional FLOAT, 
	descripcion TEXT, 
	activo BOOLEAN, 
	tipo_conexion tipoconexion NOT NULL, 
	costo_proveedor FLOAT, 
	PRIMARY KEY (id), 
	UNIQUE (codigo)
);

CREATE INDEX ix_planes_id ON planes (id);

CREATE TABLE usuarios (
	id SERIAL NOT NULL, 
	nombre VARCHAR(100) NOT NULL, 
	email VARCHAR(150) NOT NULL, 
	hashed_password VARCHAR(255) NOT NULL, 
	rol rolusuario NOT NULL, 
	activo BOOLEAN, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	telefono VARCHAR(20), 
	dni VARCHAR(15), 
	direccion TEXT, 
	fecha_ingreso DATE, 
	PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_usuarios_email ON usuarios (email);

CREATE INDEX ix_usuarios_id ON usuarios (id);

CREATE TABLE zonas (
	id SERIAL NOT NULL, 
	nombre VARCHAR(100) NOT NULL, 
	ip_lan VARCHAR(20), 
	usuario_mikrotik VARCHAR(100), 
	password_mikrotik VARCHAR(255), 
	router_mikrotik VARCHAR(100), 
	ip_wireguard VARCHAR(20), 
	wg_public_key VARCHAR(255), 
	ip_router VARCHAR(20), 
	pool_pppoe VARCHAR(100), 
	lista_corte VARCHAR(100), 
	lat FLOAT, 
	lng FLOAT, 
	descripcion TEXT, 
	tiendas_pago TEXT, 
	activo BOOLEAN, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	UNIQUE (nombre)
);

CREATE INDEX ix_zonas_id ON zonas (id);

CREATE TABLE clientes (
	id SERIAL NOT NULL, 
	nombre VARCHAR(150) NOT NULL, 
	tipo_documento tipodocumento NOT NULL, 
	dni VARCHAR(15), 
	ruc VARCHAR(11), 
	responsable_nombre VARCHAR(150), 
	telefono VARCHAR(20), 
	telefono_whatsapp VARCHAR(20), 
	direccion TEXT, 
	lat FLOAT, 
	lng FLOAT, 
	usuario_pppoe VARCHAR(100) NOT NULL, 
	password_pppoe VARCHAR(100) NOT NULL, 
	ip_estatica VARCHAR(20), 
	zona_id INTEGER, 
	plan_id INTEGER NOT NULL, 
	cantidad_tv INTEGER NOT NULL, 
	fecha_instalacion DATE, 
	fecha_vencimiento DATE, 
	pausa_hasta DATE, 
	compromiso_pago_hasta DATE, 
	estado estadocliente NOT NULL, 
	motivo_rechazo TEXT, 
	motivo_no_instalado TEXT, 
	migrado BOOLEAN NOT NULL, 
	vendedor_id INTEGER, 
	aprobado_por_id INTEGER, 
	tecnico_instalador_id INTEGER, 
	fecha_aprobacion TIMESTAMP WITH TIME ZONE, 
	metros_cable FLOAT, 
	tipo_conexion tipoconexion, 
	estado_equipo estadoequipo, 
	equipo_marca VARCHAR(100), 
	equipo_modelo VARCHAR(100), 
	equipo_serial VARCHAR(100), 
	equipo_descripcion TEXT, 
	equipo_fecha_entrega DATE, 
	equipo_valor FLOAT, 
	cuenta_starlink_email VARCHAR(150), 
	notas TEXT, 
	pin_app VARCHAR(255), 
	fecha_ultima_activacion DATE, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	actualizado_en TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (usuario_pppoe), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id), 
	FOREIGN KEY(plan_id) REFERENCES planes (id), 
	FOREIGN KEY(vendedor_id) REFERENCES usuarios (id), 
	FOREIGN KEY(aprobado_por_id) REFERENCES usuarios (id), 
	FOREIGN KEY(tecnico_instalador_id) REFERENCES usuarios (id)
);

CREATE UNIQUE INDEX ix_clientes_dni ON clientes (dni);

CREATE INDEX ix_clientes_estado ON clientes (estado);

CREATE UNIQUE INDEX ix_clientes_ruc ON clientes (ruc);

CREATE INDEX ix_clientes_migrado ON clientes (migrado);

CREATE INDEX ix_clientes_id ON clientes (id);

CREATE TABLE gastos (
	id SERIAL NOT NULL, 
	descripcion VARCHAR(255) NOT NULL, 
	monto FLOAT NOT NULL, 
	categoria VARCHAR(100) NOT NULL, 
	fecha DATE NOT NULL, 
	proveedor VARCHAR(150), 
	numero_factura VARCHAR(100), 
	comprobante VARCHAR(255), 
	es_recurrente BOOLEAN, 
	notas TEXT, 
	zona_id INTEGER, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	registrado_por INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id), 
	FOREIGN KEY(registrado_por) REFERENCES usuarios (id)
);

CREATE INDEX ix_gastos_id ON gastos (id);

CREATE INDEX ix_gastos_zona_id ON gastos (zona_id);

CREATE TABLE jornadas_vendedor (
	id SERIAL NOT NULL, 
	vendedor_id INTEGER NOT NULL, 
	zona_id INTEGER, 
	estado estadojornada NOT NULL, 
	lat_inicio FLOAT NOT NULL, 
	lng_inicio FLOAT NOT NULL, 
	monto_pasaje FLOAT, 
	monto_reclamado FLOAT, 
	nota_reclamo TEXT, 
	reclamo_reintegrado BOOLEAN NOT NULL, 
	lat_fin FLOAT, 
	lng_fin FLOAT, 
	iniciado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	finalizado_en TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(vendedor_id) REFERENCES usuarios (id), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id)
);

CREATE INDEX ix_jornadas_vendedor_vendedor_id ON jornadas_vendedor (vendedor_id);

CREATE INDEX ix_jornadas_vendedor_estado ON jornadas_vendedor (estado);

CREATE INDEX ix_jornadas_vendedor_id ON jornadas_vendedor (id);

CREATE TABLE mensajes_masivos (
	id SERIAL NOT NULL, 
	mensaje TEXT NOT NULL, 
	plantilla_nombre VARCHAR(50), 
	zona_ids JSON, 
	estados_incluidos JSON NOT NULL, 
	meta JSON, 
	total_destinatarios INTEGER NOT NULL, 
	enviados INTEGER NOT NULL, 
	fallidos INTEGER NOT NULL, 
	estado estadomensajemasivo NOT NULL, 
	creado_por_id INTEGER, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	finalizado_en TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(creado_por_id) REFERENCES usuarios (id)
);

CREATE INDEX ix_mensajes_masivos_id ON mensajes_masivos (id);

CREATE INDEX ix_mensajes_masivos_estado ON mensajes_masivos (estado);

CREATE TABLE mufas (
	id SERIAL NOT NULL, 
	codigo VARCHAR(50) NOT NULL, 
	zona_id INTEGER NOT NULL, 
	lat FLOAT, 
	lng FLOAT, 
	descripcion TEXT, 
	trazado JSON, 
	activo BOOLEAN, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id)
);

CREATE UNIQUE INDEX ix_mufas_codigo ON mufas (codigo);

CREATE INDEX ix_mufas_id ON mufas (id);

CREATE INDEX ix_mufas_zona_id ON mufas (zona_id);

CREATE TABLE tecnico_zona (
	id SERIAL NOT NULL, 
	tecnico_id INTEGER NOT NULL, 
	zona_id INTEGER NOT NULL, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	CONSTRAINT uq_tecnico_zona UNIQUE (tecnico_id, zona_id), 
	FOREIGN KEY(tecnico_id) REFERENCES usuarios (id), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id)
);

CREATE INDEX ix_tecnico_zona_tecnico_id ON tecnico_zona (tecnico_id);

CREATE INDEX ix_tecnico_zona_zona_id ON tecnico_zona (zona_id);

CREATE INDEX ix_tecnico_zona_id ON tecnico_zona (id);

CREATE TABLE cajas_nap (
	id SERIAL NOT NULL, 
	codigo VARCHAR(50) NOT NULL, 
	zona_id INTEGER NOT NULL, 
	mufa_id INTEGER, 
	lat FLOAT, 
	lng FLOAT, 
	capacidad_bornes INTEGER NOT NULL, 
	descripcion TEXT, 
	activo BOOLEAN, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(zona_id) REFERENCES zonas (id), 
	FOREIGN KEY(mufa_id) REFERENCES mufas (id)
);

CREATE INDEX ix_cajas_nap_id ON cajas_nap (id);

CREATE INDEX ix_cajas_nap_mufa_id ON cajas_nap (mufa_id);

CREATE UNIQUE INDEX ix_cajas_nap_codigo ON cajas_nap (codigo);

CREATE INDEX ix_cajas_nap_zona_id ON cajas_nap (zona_id);

CREATE TABLE corridas (
	id SERIAL NOT NULL, 
	mufa_id INTEGER NOT NULL, 
	nombre VARCHAR(60) NOT NULL, 
	color VARCHAR(9) NOT NULL, 
	metros FLOAT, 
	trazado JSON, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(mufa_id) REFERENCES mufas (id)
);

CREATE INDEX ix_corridas_mufa_id ON corridas (mufa_id);

CREATE INDEX ix_corridas_id ON corridas (id);

CREATE TABLE historial (
	id SERIAL NOT NULL, 
	cliente_id INTEGER NOT NULL, 
	tipo tipohistorial NOT NULL, 
	descripcion TEXT NOT NULL, 
	usuario_id INTEGER, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id), 
	FOREIGN KEY(usuario_id) REFERENCES usuarios (id)
);

CREATE INDEX ix_historial_id ON historial (id);

CREATE TABLE mensajes_masivos_envios (
	id SERIAL NOT NULL, 
	mensaje_masivo_id INTEGER NOT NULL, 
	cliente_id INTEGER NOT NULL, 
	estado estadoenviomasivo NOT NULL, 
	error TEXT, 
	enviado_en TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(mensaje_masivo_id) REFERENCES mensajes_masivos (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id)
);

CREATE INDEX ix_mensajes_masivos_envios_id ON mensajes_masivos_envios (id);

CREATE INDEX ix_mensajes_masivos_envios_estado ON mensajes_masivos_envios (estado);

CREATE INDEX ix_mensajes_masivos_envios_mensaje_masivo_id ON mensajes_masivos_envios (mensaje_masivo_id);

CREATE TABLE onus (
	id SERIAL NOT NULL, 
	numero_serie VARCHAR(100) NOT NULL, 
	mac VARCHAR(50), 
	marca VARCHAR(100), 
	wifi_version wifiversion, 
	estado estadoonu NOT NULL, 
	tecnico_id INTEGER, 
	cliente_id INTEGER, 
	fecha_asignacion_tecnico DATE, 
	fecha_instalacion DATE, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(tecnico_id) REFERENCES usuarios (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id)
);

CREATE INDEX ix_onus_estado ON onus (estado);

CREATE INDEX ix_onus_tecnico_id ON onus (tecnico_id);

CREATE UNIQUE INDEX ix_onus_numero_serie ON onus (numero_serie);

CREATE INDEX ix_onus_id ON onus (id);

CREATE INDEX ix_onus_cliente_id ON onus (cliente_id);

CREATE TABLE pagos (
	id SERIAL NOT NULL, 
	cliente_id INTEGER NOT NULL, 
	monto FLOAT NOT NULL, 
	mes_pagado VARCHAR(7) NOT NULL, 
	fecha_pago DATE NOT NULL, 
	metodo_pago VARCHAR(50), 
	numero_operacion VARCHAR(100), 
	estado estadopago, 
	ruta_comprobante VARCHAR(500), 
	notas TEXT, 
	grupo_adelanto VARCHAR(36), 
	descuento FLOAT, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	registrado_por INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id), 
	UNIQUE (numero_operacion), 
	FOREIGN KEY(registrado_por) REFERENCES usuarios (id)
);

CREATE INDEX ix_pagos_grupo_adelanto ON pagos (grupo_adelanto);

CREATE INDEX ix_pagos_id ON pagos (id);

CREATE TABLE ubicaciones_vendedor (
	id SERIAL NOT NULL, 
	jornada_id INTEGER NOT NULL, 
	lat FLOAT NOT NULL, 
	lng FLOAT NOT NULL, 
	registrado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(jornada_id) REFERENCES jornadas_vendedor (id)
);

CREATE INDEX ix_ubicaciones_vendedor_jornada_id ON ubicaciones_vendedor (jornada_id);

CREATE INDEX ix_ubicaciones_vendedor_id ON ubicaciones_vendedor (id);

CREATE TABLE bornes (
	id SERIAL NOT NULL, 
	caja_nap_id INTEGER NOT NULL, 
	numero INTEGER NOT NULL, 
	estado estadoborne NOT NULL, 
	cliente_id INTEGER, 
	codigo_precinto VARCHAR(50), 
	potencia_optica_dbm FLOAT, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	CONSTRAINT uq_caja_borne_numero UNIQUE (caja_nap_id, numero), 
	FOREIGN KEY(caja_nap_id) REFERENCES cajas_nap (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id)
);

CREATE INDEX ix_bornes_id ON bornes (id);

CREATE INDEX ix_bornes_cliente_id ON bornes (cliente_id);

CREATE INDEX ix_bornes_caja_nap_id ON bornes (caja_nap_id);

CREATE TABLE ordenes_retiro (
	id SERIAL NOT NULL, 
	cliente_id INTEGER NOT NULL, 
	tecnico_asignado_id INTEGER, 
	motivo TEXT NOT NULL, 
	estado estadoordenretiro NOT NULL, 
	fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	fecha_retiro TIMESTAMP WITH TIME ZONE, 
	onu_retirada_id INTEGER, 
	retiro_roseta BOOLEAN, 
	retiro_patchcord BOOLEAN, 
	observaciones TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id), 
	FOREIGN KEY(tecnico_asignado_id) REFERENCES usuarios (id), 
	FOREIGN KEY(onu_retirada_id) REFERENCES onus (id)
);

CREATE INDEX ix_ordenes_retiro_cliente_id ON ordenes_retiro (cliente_id);

CREATE INDEX ix_ordenes_retiro_id ON ordenes_retiro (id);

CREATE INDEX ix_ordenes_retiro_estado ON ordenes_retiro (estado);

CREATE TABLE averias (
	id SERIAL NOT NULL, 
	cliente_id INTEGER, 
	caja_nap_id INTEGER, 
	borne_id INTEGER, 
	motivo_reportado TEXT NOT NULL, 
	diagnostico_solucion TEXT, 
	estado estadoaveria NOT NULL, 
	tecnico_asignado_id INTEGER, 
	onu_reemplazada_id INTEGER, 
	onu_nueva_id INTEGER, 
	potencia_optica_dbm FLOAT, 
	fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	fecha_atencion TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id), 
	FOREIGN KEY(caja_nap_id) REFERENCES cajas_nap (id), 
	FOREIGN KEY(borne_id) REFERENCES bornes (id), 
	FOREIGN KEY(tecnico_asignado_id) REFERENCES usuarios (id), 
	FOREIGN KEY(onu_reemplazada_id) REFERENCES onus (id), 
	FOREIGN KEY(onu_nueva_id) REFERENCES onus (id)
);

CREATE INDEX ix_averias_cliente_id ON averias (cliente_id);

CREATE INDEX ix_averias_estado ON averias (estado);

CREATE INDEX ix_averias_id ON averias (id);

CREATE INDEX ix_averias_tecnico_asignado_id ON averias (tecnico_asignado_id);

CREATE TABLE evidencias (
	id SERIAL NOT NULL, 
	averia_id INTEGER, 
	cliente_id INTEGER, 
	orden_retiro_id INTEGER, 
	tipo tipoevidencia NOT NULL, 
	ruta_archivo VARCHAR(500) NOT NULL, 
	descripcion TEXT, 
	subido_por_id INTEGER, 
	creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(averia_id) REFERENCES averias (id), 
	FOREIGN KEY(cliente_id) REFERENCES clientes (id), 
	FOREIGN KEY(orden_retiro_id) REFERENCES ordenes_retiro (id), 
	FOREIGN KEY(subido_por_id) REFERENCES usuarios (id)
);

CREATE INDEX ix_evidencias_cliente_id ON evidencias (cliente_id);

CREATE INDEX ix_evidencias_averia_id ON evidencias (averia_id);

CREATE INDEX ix_evidencias_orden_retiro_id ON evidencias (orden_retiro_id);

CREATE INDEX ix_evidencias_id ON evidencias (id);

-- Mejora propuesta (sección de normalización): un cliente ocupa a lo
-- sumo un borne. Hoy esta regla solo se valida en la aplicación.
CREATE UNIQUE INDEX uq_borne_cliente ON bornes (cliente_id) WHERE cliente_id IS NOT NULL;
