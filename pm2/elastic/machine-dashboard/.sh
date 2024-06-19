#!/bin/bash
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
source /tmp/nice-shell.sh

log "Creating harb machine-specific dashboard. (KIBANA_URL='$KIBANA_URL', MACHINE='$MACHINE')"

if [ "$KIBANA_URL" == "" ]; then
    log "KIBANA_URL is empty. Setting to 'http://localhost:5601'"
    KIBANA_URL="http://localhost:5601"
fi

if [ "$MACHINE" == "" ]; then
    throw "MACHINE not set"
fi

export NODE_NO_WARNINGS=1
httpyac send .http --all --var host=$KIBANA_URL machine=$MACHINE --output short