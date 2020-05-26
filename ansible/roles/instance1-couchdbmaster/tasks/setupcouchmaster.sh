#!/bin/bash

# Team 46
# Haoyue Xie 1003068 @Melbourne
# Jiayu Li 713551 @Melbourne
# Ruqi Li 1008342 @Melbourne
# Yi Zhang 1032768 @Melbourne
# Zimeng Jia 978322 @Hebei, China


sleep 3


echo "== Set variables =="
declare -a nodes=(172.26.131.147 172.26.134.71 172.26.130.67)
export masternode=`echo ${nodes} | cut -f1 -d' '`
export declare -a othernodes=`echo ${nodes[@]} | sed s/${masternode}//`
export size=${#nodes[@]}
export user=admin
export password=90024
export VERSION='2.3.0'
export cookie='comp90024auzlife'




docker exec couch_master bash -c "echo \"-setcookie ${cookie}\" >> /opt/couchdb/etc/vm.args"
docker exec couch_master bash -c "echo \"-name couchdb@${masternode}\" >> /opt/couchdb/etc/vm.args"

docker restart couch_master
sleep 15

echo "== Enable cluster setup =="
for (( i=0; i<${size}; i++ )); do
    curl -X PUT "http://${nodes[${i}]}:5984/_node/_local/_config/admins/${user}" --data "\"${password}\""
    sleep 3
    curl -X PUT "http://${user}:${password}@${nodes[${i}]}:5984/_node/couchdb@${nodes[${i}]}/_config/chttpd/bind_address" --data '"0.0.0.0"'
    sleep 2
done

echo "== Add nodes to cluster =="
for (( i=0; i<${size}; i++ )); do
    if [ "${nodes[${i}]}" != "${masternode}" ]; then
        curl -X POST -H 'Content-Type: application/json' http://${user}:${password}@${masternode}:5984/_cluster_setup \
            -d "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\", \"username\": \"${user}\", \"password\":\"${password}\", \"port\": 5984, \"node_count\": \"${size}\", \
            \"remote_node\": \"${nodes[${i}]}\", \"remote_current_user\": \"${user}\", \"remote_current_password\": \"${password}\"}"
        curl -X POST -H 'Content-Type: application/json' http://${user}:${password}@${masternode}:5984/_cluster_setup \
            -d "{\"action\": \"add_node\", \"host\":\"${nodes[${i}]}\", \"port\": 5984, \"username\": \"${user}\", \"password\":\"${password}\"}"
    fi
done


curl -X POST -H "Content-Type: application/json" "http://${user}:${password}@${masternode}:5984/_cluster_setup" -d '{"action": "finish_cluster"}'


for node in "${nodes[@]}"; do  curl -X GET "http://${user}:${password}@${node}:5984/_membership"; done
