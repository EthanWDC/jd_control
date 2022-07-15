#!/bin/sh
set -e

echo "overwrite sendNotify.js..."
cat /ql/data/scripts/EthanWDC_jd_control/custom_sendNotify.js > /ql/data/scripts/JDHelloWorld_jd_scripts_main/sendNotify.js

echo "update global parameters..."
task /ql/data/scripts/EthanWDC_jd_control/update_global.js now

echo "update static file..."
task /ql/data/scripts/EthanWDC_jd_control/update_file_static.js now
