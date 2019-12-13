var net = require('net'),
    JsonSocket = require('json-socket'),
    os 	= require('os-utils'),
    ip  = require('ip');
    Scrap = require('./new_scrap');
 
var port = 9838;
var server = net.createServer();
server.listen(port);
console.log("server start ...")
var ip_server = ip.address();
server.on('connection', function(socket) {
    socket = new JsonSocket(socket); 
    var cpu_free = 0;
    var secs = 1;
    console.log("someone connected!")
    os.cpuFree(function(v){
        cpu_free = v*100;
    })
    setTimeout(() => {
        console.log(cpu_free);
        if (cpu_free < 50) {
            console.log("send cpu status");
            socket.sendEndMessage({result: cpu_free, status: false, notes: "cpu tidak mencukupi"});
        } else {
            console.log("send cpu status");
            socket.sendMessage({result: cpu_free, status: true, notes: "cpu mencukupi"});
        }
    },1000);
    socket.on('message', function(message) { // jika menerima pesan
        if (message.command == "start") {
            console.log("start scraping ...");
            Scrap(message.part).then(function(data) {
                result = {
                    result: data,
                    status: true,
                    notes: "done"
                }
                console.log("scraping done...");
                socket.sendEndMessage(result); // sendEndMessage() socket di tutup
            });
            os.cpuFree(function(v){
                cpu_free = v*100;
            })
            setTimeout(() => {
                socket.sendMessage({
                    result: cpu_free,
                    secs: 0, 
                    status: true, 
                    notes: "idle",
                    ip: ip_server
                });
            },1000);
        }
        if (message == "send_idle") {
            os.cpuFree(function(v){
                cpu_free = v*100;
            })
            setTimeout(() => {
                socket.sendMessage({
                    result: cpu_free, 
                    secs: secs, 
                    status: true, 
                    notes: "idle", 
                    ip: ip_server
                });
                secs++;
            },1000);
        }
    });
});