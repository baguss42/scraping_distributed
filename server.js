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
    setTimeout(() => {
        console.log(cpu_free);
        if (cpu_free < 99) {
            socket.sendEndMessage({result: cpu_free, status: false});
        } else {
            Scrap().then(function(data) {
                console.log(data);
                socket.sendEndMessage({result: data, status: true});
            });
        }
    },1000);
    // socket.on('message', function(message) { // jika menerima pesan
    //     console.log("start scraping ...");
    // });
});