#!/bin/bash

# Team 46
# Haoyue Xie 1003068 @Melbourne
# Jiayu Li 713551 @Melbourne
# Ruqi Li 1008342 @Melbourne
# Yi Zhang 1032768 @Melbourne
# Zimeng Jia 978322 @Hebei, China

. ./openrc.sh; ansible-playbook -i hosts -u ubuntu --key-file=./winkey.pem docker.yaml
