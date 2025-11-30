#!/bin/bash
export PATH="/Users/affanlaptops/.nvm/versions/node/v22.11.0/bin:$PATH"
cd android
./gradlew --stop
cd ..
npm run quest
