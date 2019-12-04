const netList = require('network-list');
// netList.scan({}, (err, arr) => {
//     console.log(arr); // array with all devices
// });
netList.scanEach({}, (err, obj) => {
    if (obj.alive) {
        console.log(obj); // device object
        // process.exit(); // jika data sudah diterima
    }
});