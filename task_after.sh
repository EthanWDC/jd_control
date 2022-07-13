#!/bin/sh
set -e

jdpath="../JDHelloWorld_jd_scripts_main/"

echo "overwrite sendNotify.js..."
cat EthanWDC_jd_control/custom_sendNotify.js > "./JDHelloWorld_jd_scripts_main/sendNotify.js"

echo "update global parameters..."
task "EthanWDC_jd_control/update_global.js" now
