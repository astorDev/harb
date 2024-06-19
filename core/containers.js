const coreExec = require('child_process').exec
const { dockerAll } = require('systeminformation')

async function containers() {
    statsRaw = await exec('docker stats --no-stream --format "{{ json .}}"');
    df = await exec('docker system df --format "{{ json . }}" --verbose')
    siContainers = await dockerAll();
    
    stats = statsRaw.split(/\r?\n/).filter(r => r != '').map(r => JSON.parse(r))
    volumes = JSON.parse(df).Volumes

    return stats.map(s => assembleContainerInformation(s, siContainers, volumes))
}

function assembleContainerInformation(s, siContainers, volumes) {
    var sic = siContainers.find(c => c.name == s.Name)
    var cv = volumes.filter(v => sic.mounts.some(m => m.Name == v.Name)).map(v => v.Size)
    var rx = cv.map(s => {
        var matches = /^\d*\.?\d*/.exec(s);
        var unit = s.replace(matches[0], '')
        var unitBytes = {
            "MiB": 1024 * 1024,
            "MB": 1000 * 1000,
            "GiB": 1024 * 1024 * 1024,
            "GB": 1000 * 1000 * 1000,
            "kB": 1000,
            "B": 1
        }

        var multiplier = unitBytes[unit]
        return matches[0] * multiplier;
    })

    return {
        id: sic.id,
        name: sic.name,
        cpu: +s.CPUPerc.replace('%', ''),
        ram: sic.memUsage,
        storage: rx.reduce((a, b) => a + b, 0)
    }
}


async function exec(cmd) {
    return new Promise(function (resolve, reject) {
        coreExec(cmd, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = containers;