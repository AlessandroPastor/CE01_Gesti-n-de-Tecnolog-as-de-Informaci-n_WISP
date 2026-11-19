-- =====================================================================
-- 09_monitoreo.sql — Consultas de monitoreo de la base (evidencia CE0224)
-- Pensadas para correr a diario desde MON-01 (Zabbix) o a mano.
-- =====================================================================
\echo '--- M1: tamaño de la base de datos'
SELECT pg_size_pretty(pg_database_size(current_database())) AS tamano_bd;

\echo '--- M2: tablas más grandes'
SELECT relname AS tabla, pg_size_pretty(pg_total_relation_size(relid)) AS tamano, n_live_tup AS filas
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 5;

\echo '--- M3: tasa de aciertos de caché (objetivo > 99 %)'
SELECT round(100.0 * sum(blks_hit) / nullif(sum(blks_hit) + sum(blks_read), 0), 2) AS cache_hit_pct
FROM pg_stat_database WHERE datname = current_database();

\echo '--- M4: conexiones por usuario y estado'
SELECT usename, state, COUNT(*) FROM pg_stat_activity
WHERE datname = current_database() GROUP BY usename, state ORDER BY 3 DESC;

\echo '--- M5: tablas con más lecturas secuenciales (candidatas a índice)'
SELECT relname, seq_scan, idx_scan FROM pg_stat_user_tables
ORDER BY seq_scan DESC LIMIT 5;

\echo '--- M6: eventos de auditoría registrados'
SELECT operacion, COUNT(*) FROM auditoria_pagos GROUP BY operacion;
