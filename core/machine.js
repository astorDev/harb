const si = require('systeminformation')

async function machine() {
    var load = await si.currentLoad()
    var mem = await si.mem()
    var storage = await si.fsSize();
    var totalStorage = storage.map(s => s.used + s.available).reduce((a, b) => a + b);
    var usedStorage = storage.map(s => s.used).reduce((a, b) => a + b);
    
    return {
        cpu : resource(load.currentLoad, 100),
        ram : resource(mem.active, mem.total),
        storage : resource(usedStorage, totalStorage)
    }

    function resource(used, total) {
        return {
            used : +used.toFixed(2),
            total : total,
            fraction : +(used / total).toFixed(2)
        }
    }
}

module.exports = machine;