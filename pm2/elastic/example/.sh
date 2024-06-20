#!/bin/bash
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
. /tmp/nice-shell.sh

docker compose up -d
cd ../global-dashboard

if [ -z "$TIMER_DURATION" ]; then
  log "TIMER_DURATION is not set. Using default value of 30 seconds."
  TIMER_DURATION=30
fi

echo "Warming up Kibana. Starting $TIMER_DURATION seconds timer."

for ((i=$TIMER_DURATION; i>-1; i--)); do
  sleep 1
  printf "\r%02d seconds left" "$i"
done

export KIBANA_URL=http://localhost:5601
sh .sh
cd ../machine-dashboard
export MACHINE=one
sh .sh
export MACHINE=two
sh .sh
cd ../example