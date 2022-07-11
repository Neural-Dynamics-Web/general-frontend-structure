#!/bin/bash

cp -r /usr/src/node_modules/ /usr/src/app/
cp /usr/src/pnpm-lock.yaml /usr/src/app/
cp /usr/src/package.json /usr/src/app/

exec "$@"
