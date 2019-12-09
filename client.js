var net = require('net'),
    JsonSocket = require('json-socket'),
    LANScanner = require('lanscanner'),
    fs = require('fs');

var port = 9838;
var result = [];
var part = [1,2,3,4,5,6];
var ip_connected = [];
// Start function
function start() {
    console.log("Client start ...");
    LANScanner.scan('ip').then(async function( networkList ) {
        // networkList.push('10.7.5.81');
        // networkList = ['10.7.5.81','10.7.5.90'];
        for(var i = 0; i<networkList.length; i++) {
            var host = networkList[i];
            var s = await scanConnect(host);
            // console.log(s);
            if (i == networkList.length-1) {
                close();
            } 
        }
    });
}


function close(data) {
    // console.log(data.result);
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
        socket.setTimeout(3000);
        client.on('error', function(ex) {
            resolve(false)
        });
        socket.on('timeout', function name(params) {
            resolve(false)
        })
        socket.on('connect', function() {
            console.log("connected to " + host + " ...");
            console.log("waiting for response " + host + " ...");
            ip_connected.push(host);
            socket.on('message', function(data) {
                console.log(data.notes);
                if(data.status && data.notes == "done") {
                    // close(data);
                    result.push(data.result);
                    part.shift();
                    resolve(true);
                    fs.writeFileSync('result.json', JSON.stringify(result));
                }
                if (data.status && data.notes != "done") {
                    var command = {
                        command: "start",
                        part: part.length-1
                    }
                    console.log("send request scraping to server " + host);
                    console.log(command);
                    socket.sendMessage(command);
                }
                if (!data.status) {
                    resolve(true);
                }
            });
        });
        socket.on('disconnect', function(){
            console.log('disconected');
        });
    });
}

start();