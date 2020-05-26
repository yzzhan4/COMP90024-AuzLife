#!/bin/bash

# Team 46
# Haoyue Xie 1003068 @Melbourne
# Jiayu Li 713551 @Melbourne
# Ruqi Li 1008342 @Melbourne
# Yi Zhang 1032768 @Melbourne
# Zimeng Jia 978322 @Hebei, China

# Create databases
curl -XPUT "http://admin:90024@172.26.131.147:5984/streaming-userids?partitioned=true"
curl -XPUT "http://admin:90024@172.26.131.147:5984/streaming-tweets?partitioned=true"

# On local machine:
# upload local couchdb data to remote
python3 local_to_couch.py


# install python packages
# run harvester
nohup python3 -u streaming.py &

