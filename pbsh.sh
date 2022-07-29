#!/bin/bash

# npx protobufjs-cli -t json public/protos/*.proto > ./public/proto.json
# https://www.npmjs.com/package/protobufjs#pbjs-for-javascript
# npx protobufjs-cli -t json-module -w default -o ./public/proto.js public/protos/*.proto
./node_modules/protobufjs-cli/bin/pbjs -t json ./public/protos/*.proto > ./public/proto.json
