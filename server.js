var net = require('net'),
    JsonSocket = require('json-socket'),
    os 	= require('os-utils')
    Scrap = require('./scrap');
 
var port = 9838;
var server = net.createServer();
server.listen(port);
console.log("server start ...")
server.on('connection', function(socket) {
    socket = new JsonSocket(socket); 
    var cpu_free = 0;
    console.log("someone connected!")
    os.cpuFree(function(v){
        cpu_free = v*100;
    })
    var isRunning = false;
    setTimeout(() => {
        console.log(cpu_free);
        if (cpu_free < 50) {
            socket.sendMessage({result: cpu_free, status: false, notes: "cpu tidak mencukupi"});
        } else {
            socket.sendMessage({result: cpu_free, status: true, notes: "cpu mencukupi"});
        }
    },1000);
    socket.on('message', function(message) { // jika menerima pesan
        if (message == "start") {
            console.log("start scraping ...");
            Scrap().then(function(data) {
                result = {
                    result: data,
                    status: true,
                    notes: "data berhasil di scrap"
                }
                console.log(result);
                socket.sendEndMessage(result); // sendEndMessage() socket di tutup
            });
        }
    });
});