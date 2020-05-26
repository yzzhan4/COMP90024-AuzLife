#!/bin/bash

# Team 46
# Haoyue Xie 1003068 @Melbourne
# Jiayu Li 713551 @Melbourne
# Ruqi Li 1008342 @Melbourne
# Yi Zhang 1032768 @Melbourne
# Zimeng Jia 978322 @Hebei, China

docker exec couch_slave2 bash -c "echo \"-setcookie comp90024auzlife\" >> /opt/couchdb/etc/vm.args"
docker exec couch_slave2 bash -c "echo \"-name couchdb@172.26.130.67\" >> /opt/couchdb/etc/vm.args"

docker restart couch_slave2
