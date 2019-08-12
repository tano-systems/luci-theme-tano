#!/bin/bash

source ./env
source ./vars

scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/htdocs/* ${TARGET_HOST}:/www
scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/luasrc/* ${TARGET_HOST}:/usr/lib/lua/5.1/luci
scp -r -P ${TARGET_HOST_PORT} ${THEME_SRC_DIR}/root/* ${TARGET_HOST}:/
scp -r -P ${TARGET_HOST_PORT} ${DIST_DIR}/*.css ${TARGET_HOST}:/www/luci-static/tano/
