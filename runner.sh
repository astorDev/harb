docker compose up -d --build &&
echo "sleeping for 60 secs for kibana to start..." &&
sleep 60 &&
cd kib && sh import.sh && cd ..