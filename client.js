var net = require('net'),
    JsonSocket = require('json-socket'),
    LANScanner = require('lanscanner'),
    fs = require('fs');

var port = 9838;
var result = [];
// Start function
function start() {
    console.log("Client start ...") 
    LANScanner.scan('ip').then(async function( networkList ) {
        // networkList.push('10.7.5.81');
        networkList = ['10.7.5.81'];
        for(var i = 0; i<networkList.length; i++) {
            var host = networkList[i];
            var s = await scanConnect(host);
            // console.log(s);
            if (s) {
                break;
            } 
        }
    });
}


function close(data) {
    console.log(data.result);
    console.log("---------------end---------------");
    //  write html file
    //  load html file
    // process.exit(0); // jika data sudah diterima
}

async function scanConnect(host) {
    return new Promise(function(resolve, reject) {
    var socket = new JsonSocket(new net.Socket());
    var client = socket.connect(port, host);
    console.log("trying connect to : "+ host);
    socket.setTimeout(500);
    client.on('error', function(ex) {
        // console.log("error : "+ ex)
        // process.exit(1); // jika data sudah diterima
        // console.log(ex);
        // ok = false;
        resolve(false)
    });
    socket.on('timeout', function name(params) {
        // console.log(params);
        // return;
        resolve(false)
    })
    socket.on('connect', function() {
        console.log("connected to " + host + " ...");
        console.log("waiting for response " + host + " ...");
        resolve(true);
        socket.on('message', function(data) {
            console.log(data.notes);
            if(data.status && data.notes == "done") {
                close(data);
                // result.push(data.result);
                // console.log(result);
            } else {
                console.log(data.result);
            }
            if (data.status) {
                socket.sendMessage("start");
            }
        });
    });
    socket.on('disconnect', function(){
        console.log('disconected');
    });
});
}

start();