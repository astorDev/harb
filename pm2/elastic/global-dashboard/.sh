#!/bin/bash
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
source /tmp/nice-shell.sh

log "Sending http request for harb dashboard. (KIBANA_URL: '$KIBANA_URL')"

if [ "$KIBANA_URL" == "" ]; then
    log "KIBANA_URL is empty. Setting to 'http://localhost:5601'"
    KIBANA_URL="http://localhost:5601"
fi

export NODE_NO_WARNINGS=1
httpyac send .http --all --var host=$KIBANA_URL --output short