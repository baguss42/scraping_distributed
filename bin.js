var net = require('net'),
    JsonSocket = require('json-socket');
 
var port = 9838; //The same port that the server is listening on
var host = ['127.0.0.1'];
for(var i = 0; i < host.length; i++) {
    console.log(host[i]);
    var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
    var client = socket.connect(port, host[i]);
    client.on('error', function(ex) {
        console.log("handled error");
        console.log(ex);
      });
    socket.on('connect', function() { //Don't send until we're connected
        socket.sendMessage({command: 'start', beginAt: 10});
        socket.on('message', function(data) {
            console.log(data);
            // if (square > 200) {
            //     socket.sendMessage({command: 'stop'});
            // }
        });
    });
}