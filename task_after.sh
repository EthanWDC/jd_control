#!/bin/sh
set -e

jdpath="../JDHelloWorld_jd_scripts_main/"

echo "overwrite sendNotify.js..."
cat custom_sendNotify.js > "${jdpath}sendNotify.js"

echo "update global parameters..."
task "update_global.js" now
