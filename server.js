var net = require('net'),
    JsonSocket = require('json-socket'),
    os 	= require('os-utils')
    Scrap = require('./scrap');
 
var port = 9838;
var server = net.createServer();
server.listen(port);
console.log("server start ...")
server.on('connection', function(socket) { //This is a standard net.Socket
    socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
    var cpu_free = 0;
    console.log("someone connected!")
    socket.on('message', function(message) {
        os.cpuFree(function(v){
            cpu_free = v*100;
        })
        setTimeout(() => {
            console.log(cpu_free);
            // socket.sendEndMessage({cpu_free: cpu_free});
            if (cpu_free > 50) {
                // socket.sendEndMessage('starting scrapping ...');
                Scrap().then(function(data) {
                    console.log(data);
                    socket.sendEndMessage(data);
                });
            }
        },1000);
        // var result = message.a + message.b;
        // var result = scrap();
    });
});