#!/bin/bash
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
. /tmp/nice-shell.sh

log "Creating harb machine-specific dashboard. (KIBANA_URL='$KIBANA_URL', MACHINE='$MACHINE')"

if [ -z "$KIBANA_URL" ]; then
    log "KIBANA_URL is empty. Setting to 'http://localhost:5601'"
    KIBANA_URL="http://localhost:5601"
fi

if [ -z "$MACHINE" ]; then
    throw "MACHINE not set"
fi

export NODE_NO_WARNINGS=1
npm install --global httpyac
log "Sending httpyac request"
httpyac send .http --all --var host=$KIBANA_URL machine=$MACHINE --output short