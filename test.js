const LANScanner = require('lanscanner');

async function start() {
    var ips = [];
    ips = await LANScanner.scan('ip').then(( networkList ) => {
        return networkList;
    });
    for(var i = 0; i < ips.length; i++) {
        console.log(ips[i]);
        setTimeout(async function(i) {
            await cons("aaaa");
        }, 3000)
    }
    // console.log(ips); 
}
// async function getIpList() {
//     await LANScanner.scan('ip').then(( networkList ) => {
//         return networkList;
//     });
// }
async function cons(log) {
    console.log(log);
}

start();