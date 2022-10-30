#! /usr/bin/env node
const si = require('systeminformation')
const { program } = require('commander')
const { exec } = require('child_process')

program
    .command('machine')
    .description('Retrieves machine resources utilization information')
    .action(machine)

program
    .command('containers')
    .description("Retrieves resources utilization by containers")
    .action(containers)

program.parse()

async function machine() {
    var load = await si.currentLoad()
    var mem = await si.mem()
    var storage = await si.fsSize();
    var usedStorage = storage.map(s => s.used).reduce((a, b) => a + b);
    
    logAsJson({
        cpu : resource(load.currentLoad, 100),
        ram : resource(mem.active, mem.total),
        storage : resource(usedStorage, storage[0].size)
    })

    function resource(used, total) {
        return {
            used : +used.toFixed(2),
            total : total,
            fraction : +(used / total).toFixed(2)
        }
    }
}

async function containers() {
    statsRaw = await run('docker stats --no-stream --format "{{ json .}}"');
    df = await run('docker system df --format "{{ json . }}" --verbose')
    siContainers = await si.dockerAll();
    
    stats = statsRaw.split(/\r?\n/).filter(r => r != '').map(r => JSON.parse(r))
    volumes = JSON.parse(df).Volumes

    containers = stats.map(s => {
        var sic = siContainers.find(c => c.name == s.Name)
        var cv = volumes.filter(v => sic.mounts.some(m => m.Name == v.Name)).map(v => v.Size)
        var rx = cv.map(s => {
            var matches = /^\d*\.?\d*/.exec(s);
            var unit = s.replace(matches[0], '')
            var unitBytes = {
                "MiB" : 1024 * 1024,
                "MB" : 1000 * 1000,
                "GiB" : 1024* 1024 * 1024,
                "GB" : 1000 * 1000 * 1000,
                "kB" : 1000,
                "B" : 1
            }

            var multiplier = unitBytes[unit]
            return matches[0] * multiplier;
        })

        return {
            id : sic.id,
            name : sic.name,
            cpu : +s.CPUPerc.replace('%', ''),
            ram : sic.memUsage,
            storage : rx.reduce((a, b) => a + b, 0)
        }
    })

    logAsJson(containers)
}

async function run(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout) => {
          if (err) {
            reject(err);
          } else {
            resolve(stdout);
          }
        });
      });
}

function logAsJson(obj) {
    console.log(JSON.stringify(obj, null, 2))
}