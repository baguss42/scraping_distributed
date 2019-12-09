var net = require('net'),
    JsonSocket = require('json-socket'),
    LANScanner = require('lanscanner'),
    fs = require('fs');

var port = 9838;
var result = [];
var part = [1];
var ip_connected = [];
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
        while(part.length > part.result) {
            console.log("aaa")
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
            resolve(false)
        });
        socket.on('timeout', function name(params) {
            resolve(false)
        })
        socket.on('connect', function() {
            console.log("connected to " + host + " ...");
            console.log("waiting for response " + host + " ...");
            resolve(true);
            ip_connected.push(host);
            socket.on('message', function(data) {
                console.log(data.notes);
                if(data.status && data.notes == "done") {
                    // close(data);
                    part.shift();
                    result.push(data.result);
                    console.log(result.length);
                    console.log(part.length);
                    console.log(ip_connected.length);
                } else {
                    console.log(data.result);
                }
                if (data.status && data.notes != "done") {
                    var command = {
                        command: "start",
                        part: part.length-1
                    }
                    socket.sendMessage(command);
                }
            });
        });
        socket.on('disconnect', function(){
            console.log('disconected');
        });
    });
}

start();