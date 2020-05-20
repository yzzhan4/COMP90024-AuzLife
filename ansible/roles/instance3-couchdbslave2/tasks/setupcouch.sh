#!/bin/bash


docker exec couch_slave2 bash -c "echo \"-setcookie comp90024auzlife\" >> /opt/couchdb/etc/vm.args"
docker exec couch_slave2 bash -c "echo \"-name couchdb@172.26.130.67\" >> /opt/couchdb/etc/vm.args"

docker restart couch_slave2
