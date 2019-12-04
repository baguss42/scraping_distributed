var os 	= require('os-utils');
os.cpuUsage(function(v){
	console.log( 'CPU Usage (%): ' + v*100 );
});

os.cpuFree(function(v){
	console.log( 'CPU Free:' + v*100 );
});