var net = require('net'),
    JsonSocket = require('json-socket'),
    LANScanner = require('lanscanner'),
    fs = require('fs');

var port = 9838;
var result = [];
var part = [1,2,3,4,5,6];
var len = part.length;
var ip_connected = [];
var idle = {};
// Start function
function start() {
    console.log("Client start ...");
    LANScanner.scan('ip').then(async function( networkList ) {
        // networkList.push('10.7.5.81'); // for testing only
        // networkList = ['10.7.5.81','10.7.5.90'];
        for(var i = 0; i<networkList.length; i++) {
            var host = networkList[i];
            var s = await scanConnect(host);
            // console.log(s);
            if (result.length == len) break;
            if (i == networkList.length-1) {
                fs.writeFileSync('idle.json', JSON.stringify(idle));
                break;
            } 
        }
    });
}


function writeResult(data, ip) {
    result.push(data);
    part.shift();
    fs.writeFileSync('result.json', JSON.stringify(result));
    fs.appendFileSync('ip_connected_history.txt', ip + ",");
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
                if(data.status && data.notes == "idle") {
                    var ips = data.ip.toString();
                        if (typeof idle[ips] === "undefined") {
                            idle[ips] = [data.result];
                        } else {
                            var temp = idle[ips];
                            temp.push(data.result);
                            idle[ips] = temp
                        }
                    socket.sendMessage("send_idle");
                }
                if(data.status && data.notes == "done") { // write result
                    resolve(true);
                    var res = data.result;
                    if (!isEmpty(res)) {
                        writeResult(res,host);
                    }
                }
                if (data.status && data.notes == "cpu mencukupi") { // cpu ok
                    var command = {
                        command: "start",
                        part: part.length-1
                    }
                    console.log("send request scraping to server " + host);
                    console.log(command);
                    socket.sendMessage(command);
                }
                if (!data.status) { // cpu not ok
                    resolve(true);
                }
            });
        });
        socket.on('disconnect', function(){
            console.log('disconected');
        });
    });
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

start();