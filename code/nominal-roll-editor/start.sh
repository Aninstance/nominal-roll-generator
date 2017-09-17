#!/bin/bash
# ensure npm installed
npm --prefix /home/nodejs/app/code install --production
# start app
dumb-init node server.js --harmony_array_includes
