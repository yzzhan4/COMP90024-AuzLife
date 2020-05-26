# Team 46
# Haoyue Xie 1003068 @Melbourne
# Jiayu Li 713551 @Melbourne
# Ruqi Li 1008342 @Melbourne
# Yi Zhang 1032768 @Melbourne
# Zimeng Jia 978322 @Hebei, China

# create image based on node from dockerhub
FROM node:latest


# create a dir where app will run
RUN mkdir -p /usr/src/server

# set the working dir
WORKDIR /usr/src/server


# install project dependencies
RUN npm install

# build app for production with minification

# set port

CMD ["node", "server.js"]