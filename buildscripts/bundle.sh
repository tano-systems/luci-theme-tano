#!/bin/bash

source ./vars

BUNDLE_DIR=${SCRIPT_DIR}/bundle
BUNDLE_BUILD_DIR=${BUNDLE_DIR}/build
TIMESTAMP=`date +"%Y%m%d%H%M%S"`

mkdir -p ${BUNDLE_BUILD_DIR}
rm -rf ${BUNDLE_BUILD_DIR}/*

cp -r ${THEME_SRC_DIR}/* ${BUNDLE_BUILD_DIR}/
cp ${DIST_DIR}/*.css ${BUNDLE_BUILD_DIR}/htdocs/luci-static/tano/
cp ${THEME_SRC_DIR}/Makefile ${BUNDLE_BUILD_DIR}

tar -czvf ${BUNDLE_DIR}/${THEME_NAME}-${TIMESTAMP}.tar.gz -C ${BUNDLE_BUILD_DIR} .
