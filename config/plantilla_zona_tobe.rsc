# =====================================================================
# Plantilla TO-BE de router de zona WISP (RouterOS 7) - DISENO
# ZZ = id de la zona en el sistema. En 10.10.0.1ZZ va con dos digitos
# (SUCASCO, id 1 -> 10.10.0.101 y 172.16.1.0/28)
# Sin secretos: las llaves se generan en el equipo y la PSK se entrega
# por canal seguro. Se valida en la implementacion del semestre 2.
# =====================================================================

# --- 1. Tunel de gestion WireGuard hacia el hub en AWS ----------------
/interface wireguard add name=wg-wisp listen-port=13231 comment="gestion WISP"
/interface wireguard peers add interface=wg-wisp public-key="<PUBKEY-HUB>" \
    preshared-key="<PSK-ZONA>" endpoint-address=<EIP-HUB> endpoint-port=51820 \
    allowed-address=10.10.0.0/24,10.20.10.0/24,10.20.20.0/24,10.20.50.0/24 \
    persistent-keepalive=25s
/ip address add address=10.10.0.1ZZ/24 interface=wg-wisp
/ip route add dst-address=10.20.10.0/24 gateway=wg-wisp
/ip route add dst-address=10.20.20.0/24 gateway=wg-wisp
/ip route add dst-address=10.20.50.0/24 gateway=wg-wisp

# --- 2. VLAN 99 de gestion (OLT) ---------------------------------------
/interface vlan add interface=ether9 name=vlan99-gestion vlan-id=99
/ip address add address=172.16.ZZ.1/28 interface=vlan99-gestion

# --- 3. Listas -----------------------------------------------------------
/interface list add name=MGMT
/interface list member add interface=wg-wisp list=MGMT
/interface list member add interface=vlan99-gestion list=MGMT
/ip firewall address-list
add list=GESTION address=10.20.20.10 comment="APP-01 (sistema)"
add list=GESTION address=10.20.10.0/24 comment="VLAN de gestion de la oficina"
add list=MONITOREO address=10.20.50.0/24 comment="MON-01 / SIEM-01"

# --- 4. Filtro: default deny ---------------------------------------------
/ip firewall filter
add chain=input connection-state=established,related action=accept
add chain=input connection-state=invalid action=drop
add chain=input protocol=icmp action=accept
add chain=input protocol=udp dst-port=13231 action=accept comment="WireGuard"
add chain=input in-interface=wg-wisp src-address-list=GESTION protocol=tcp \
    dst-port=22,8291,8729 action=accept comment="SSH, Winbox, API-SSL"
add chain=input in-interface=wg-wisp src-address-list=MONITOREO protocol=udp \
    dst-port=161 action=accept comment="SNMPv3"
add chain=input in-interface-list=LAN protocol=udp dst-port=53 action=accept
add chain=input in-interface-list=LAN protocol=tcp dst-port=53,998 action=accept \
    comment="DNS y proxy de aviso de corte, solo LAN"
add chain=input action=drop log=yes log-prefix="DROP-IN"
add chain=forward connection-state=established,related action=accept
add chain=forward connection-state=invalid action=drop
add chain=forward in-interface-list=LAN out-interface-list=WAN action=accept \
    comment="clientes a internet"
add chain=forward in-interface=wg-wisp out-interface=vlan99-gestion \
    src-address-list=MONITOREO action=accept comment="monitoreo de la OLT"
add chain=forward in-interface=wg-wisp out-interface=vlan99-gestion \
    src-address-list=GESTION action=accept comment="gestion de la OLT"
add chain=forward action=drop log=yes log-prefix="DROP-FWD"

# --- 5. Servicios ----------------------------------------------------------
/ip service
set telnet disabled=yes
set ftp disabled=yes
set www disabled=yes
set api disabled=yes
set ssh address=10.20.20.10/32,10.20.10.0/24
set winbox address=10.20.10.0/24
set api-ssl address=10.20.20.10/32
/ip neighbor discovery-settings set discover-interface-list=LAN
/tool bandwidth-server set enabled=no

# --- 6. Hora y registro centralizado ---------------------------------------
/system ntp client set enabled=yes
/system ntp client servers add address=pe.pool.ntp.org
/system logging action add name=siem target=remote remote=10.20.50.11
/system logging add topics=firewall action=siem
/system logging add topics=account action=siem
/system logging add topics=system,error action=siem

# --- 7. Se conservan de la configuracion actual -----------------------------
# Servidor PPPoE en bridgeLAN, perfiles PLAN01..PLAN04 con colas CAKE,
# address-list "CORTE MOROSO" con redireccion al proxy :998 y el failover WAN.
