npm install --global pm2
npm install --global harb-cli
pm2 update
pm2 delete harb-machine
pm2 delete harb-containers
pm2 start harb --no-autorestart --name harb-machine --cron "*/5 * * * * *" -- machine --compact
pm2 start harb --no-autorestart --name harb-containers --cron "*/30 * * * * *" -- containers --compact
pm2 save
pm2 startup