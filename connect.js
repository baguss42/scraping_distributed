var net = require('net'),
    JsonSocket = require('json-socket'),
    data = [];

function scanConnect(host) {
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
            if (!data.status) {
                console.log("cpu tidak memenuhi");
                console.log(data.result);
                console.log(data);
            } else {
                // cons(data);
                console.log(data);
                setData(data);
                setOk(false);
            }
        });
    });
}

function setOk(ok) {
    return ok;
}

function setData(data) {
    data = data;
}

function getData() {
    return data;
}

const connect = async function(host) {
    var ok = true;
    console.log(host);
    scanConnect(host);
    while(ok) {
        // console.log(ok);
        ok = setOk(true);
    }
    if (!ok) {
        return getData(); 
    }
}

module.exports = connect;