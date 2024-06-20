#! /usr/bin/env node

const { program } = require('commander')
const { machine, containers } = require('harb-core')
const { spawn } = require('child_process')

program
    .command('machine')
    .description('Retrieves machine resources utilization information')
    .option('--compact', 'No JSON pretty print')
    .action(async (options) => {
        var m = await machine();
        logAsJson(m, options.compact)
    })

program
    .command('containers')
    .description("Retrieves resources utilization by containers")
    .option('--compact', 'No JSON pretty print')
    .option('--disarray', 'Single lines instead of array')
    .action(async (opt) => {
        var cs = await containers()

        if (opt.disarray) {
            for (var c of cs) {
                logAsJson(c, opt.compact)
            }
        }
        else {
            logAsJson(cs, opt.compact)
        }
    })

var pm2 = program
    .command('pm2')
    .description('Operations on harb PM2-based infrastructure')

pm2
    .command('install')
    .description('Installs PM2 periodic harb jobs')
    .action(async () => {
        await execRemotely(
`
cd pm2
sh install.sh
`);
    })

var pm2Elastic = pm2
    .command('elastic')
    .description('Operations on elastic infrastructure based on PM2')

pm2Elastic
    .command('global-dashboard')
    .description("Creates global harb elastic dashboard")
    .option('--kibana-url', 'Kibana URL', 'http://localhost:5601')
    .action(async (opt) => {
        await execRemotely(`
cd pm2/elastic/global-dashboard
export KIBANA_URL=${opt.kibanaUrl}
sh .sh    
`)
    })

pm2Elastic
    .command('machine-dashboard')
    .description("Creates a harb elastic dashboard for particular machine")
    .requiredOption('--machine <name>', 'Machine name')
    .option('--kibana <url>', 'Kibana URL', 'http://localhost:5601')
    .action(async (opt) => {
        await execRemotely(`
cd pm2/elastic/machine-dashboard
export MACHINE=${opt.machine}
export KIBANA_URL=${opt.kibana}
sh .sh
`)
    })

program.parse()

function logAsJson(obj, compact = false) {
    console.log(JSON.stringify(obj, null, compact ? 0 : 2))
}

async function execRemotely(cmd) {
    await spawn(`
curl -s https://raw.githubusercontent.com/astorDev/nice-shell/main/.sh -o /tmp/nice-shell.sh
source /tmp/nice-shell.sh

log "Executing script from harb repository."    
cd /tmp
log "Removing harb directory from temp folder"
rm -rf harb
log "Cloning harb repository"
git clone https://github.com/astorDev/harb.git
cd harb
${cmd}
`,
    {
        shell: true,
        stdio: ['ignore', 'inherit', 'inherit']
    });
}