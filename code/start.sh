#!/bin/bash
# ensure npm installed
npm install --production
# start app
dumb-init node index.js --harmony_array_includes