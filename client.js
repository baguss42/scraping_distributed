var net = require('net'),
    JsonSocket = require('json-socket'),
    LANScanner = require('lanscanner'),
    scarapConnect = require('./connect');

// Start function
function start() {
    console.log("Client start ...") 
    LANScanner.scan('ip').then(async function( networkList ) {
        networkList.push('10.7.5.81');
        networkList.push('10.7.5.99');
        // networkList = ['10.7.5.81'];
        for(var i = 0; i<networkList.length; i++) {
            var host = networkList[i];
            // console.log(host);
            await scanConnect(host);
            // cons(res);
            // await scanConnect(host);
            // var data = scanConnect(host);
            // if (typeof data !== "undefined") {
            //     console.log(data);
            //     console.log("finish") ;
            //     process.exit(0); // jika data sudah diterima
            // }
        }
    });
}

function cons(data) {
    console.log(data);
    console.log("---------------end---------------");
    //  write html file
    //  load html file
    // process.exit(0); // jika data sudah diterima
}

async function scanConnect(host) {
    var port = 9838;
    var socket = new JsonSocket(new net.Socket());
    var client = socket.connect(port, host);
    client.on('error', function(ex) {
        return [];
        // process.exit(1); // jika data sudah diterima
        });
    socket.on('connect', function() {
        console.log("connect to " + host + " ...");
        console.log("waiting for response " + host + " ...");
        socket.on('message', function(data) {
            console.log(data.notes);
            console.log(data.result);
            if (data.status) {
                socket.sendMessage("start");
            }
        });
    });
    socket.on('disconnect', function(){
        console.log('disconected');
    });
}

start();
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