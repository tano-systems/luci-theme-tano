#!/bin/bash

source ./env
source ./vars

RUN_SSHPASS=""
if [ -n "${TARGET_PASSWORD}" ]; then
	RUN_SSHPASS="sshpass -e"
	export SSHPASS="${TARGET_PASSWORD}"
fi

${RUN_SSHPASS} scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/htdocs/* ${TARGET_HOST}:/www
${RUN_SSHPASS} scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/luasrc/* ${TARGET_HOST}:/usr/lib/lua/5.1/luci
${RUN_SSHPASS} scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/root/* ${TARGET_HOST}:/
${RUN_SSHPASS} scp -r -P ${TARGET_HOST_PORT} ${DIST_DIR}/*.css ${TARGET_HOST}:/www/luci-static/tano/
