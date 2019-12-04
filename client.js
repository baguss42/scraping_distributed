var net = require('net'),
    JsonSocket = require('json-socket'),
    netList = require('network-list');

console.log("Client start ...") 
var port = 9838; //The same port that the server is listening on
netList.scanEach({}, (err, obj) => {
    if (obj.alive) {
        var host = obj.ip;
        // console.log(obj); // device object
        // process.exit(); // jika data sudah diterima
        console.log("connect to " + host + " ...");
        var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
        var client = socket.connect(port, host);
        client.on('error', function(ex) {
            console.log("handled error");
            console.log(ex);
            process.exit(1); // jika data sudah diterima
            });
        socket.on('connect', function() { //Don't send until we're connected
            socket.sendMessage({command: 'start', beginAt: 10});
            socket.on('message', function(data) {
                console.log(data);
                process.exit(0); // jika data sudah diterima
                // if (square > 200) {
                //     socket.sendMessage({command: 'stop'});
                // }
            });
        });
    }
});
// var host = ['192.168.1.6'];
// console.log("connect to " + host[0] + " ...");
// var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
// var client = socket.connect(port, host[0]);
// client.on('error', function(ex) {
//     console.log("handled error");
//     console.log(ex);
//     });
// socket.on('connect', function() { //Don't send until we're connected
//     socket.sendMessage({command: 'start', beginAt: 10});
//     socket.on('message', function(data) {
//         console.log(data);
//         // if (square > 200) {
//         //     socket.sendMessage({command: 'stop'});
//         // }
//     });
// });