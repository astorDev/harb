#!/bin/bash
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
. /tmp/nice-shell.sh

log "Sending http request for harb dashboard. (KIBANA_URL: '$KIBANA_URL')"

if [ -z "$KIBANA_URL" ]; then
    log "KIBANA_URL is empty. Setting to 'http://localhost:5601'"
    KIBANA_URL="http://localhost:5601"
fi


export NODE_NO_WARNINGS=1
npm install --global httpyac
log "Sending httpyac request"
httpyac send .http --all --var host=$KIBANA_URL --output short