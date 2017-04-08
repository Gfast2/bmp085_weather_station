var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var b = require('bonescript');
var logger = require('./logger');
var appjs = fs.readFileSync('app.js');

http.createServer(function (req, res) {

  var url = req.url;
  var method = req.method;
  var header = req.header;
  
  switch(url){
	case "/all":
	    var temper="nothing";	
		b.readTextFile(temperature,
			function(e){
				console.log('e');
				console.log(e);
				if(e.err !== null){
					res.writeHead(200, {'Content-Type':'text/html'});
					res.write('<!DOCTYPE html>');
					res.write('<head>');
					res.write('<meta charset="UTF-8">');
					res.write('</head>');
					res.write('<html>');
					res.write('<body>');
					res.write('<h1>Err!</h1>');
					res.write('<h3>');
					res.write(temper.toString());
					res.write('</h3>');
					res.write('</body>');
					res.write('</html>');
					res.end();
					return;
				}

				temper = getTemperature(e);
				res.writeHead(200, {'Content-Type':'text/html'});
				res.write('<!DOCTYPE html>');
				res.write('<head>');
				res.write('<meta charset="UTF-8">');
				res.write('</head>');
				res.write('<html>');
				res.write('<body>');
				res.write('<h1>Hi</h1>');
				res.write('<h3>');
				res.write(temper.toString());
				res.write('</h3>');
				res.write('<h3>');
				res.write((new Date()).toString());
				res.write('</h3>');
				res.write('<h5>');
				res.write('Automatic Logger:' );
				res.write( aLogger.state()=== true ? 'On' : 'Off');
				res.write('</h5>');
				res.write('</body>');
				res.write('</html>');
				res.end();
			}); 
		break;
	case "/json":
		b.readTextFile(temperature, function(e){
			var tp = Number(e.data)/10;
			res.writeHead(200, 
			{
			  'Content-Type':'application/vnd.api+json',
			  'Access-Control-Allow-Origin':'*'
			});
			res.write('{"temperature":');
			res.write(tp.toString());
			res.write('}');
			res.end();
		});
		break;
	case "/app.js":
		res.writeHead(200, {
			'Content-Type':'application/javascript',
			'charset':'UTF-8'
		});
		res.end(appjs);
		break;
	default:
		res.writeHead(200, {'Content-Type': 'text/html'});
	 	res.end(index);
  }

}).listen(8082);

console.log("Yes, the Webserver is online: port: 8082");

// Testing stuffs

var bus = 1;
// var iic = '/sys/class/i2c-adapter/i2c-' + bus + '/'; // Load sensor when start up

//Sensor Locations on the BeagleBone Black
var temperature = '/sys/bus/i2c/drivers/bmp085/' + bus + '-0077/temp0_input';
var pressure = '/sys/bus/i2c/drivers/bmp085/' + bus + '-0077/pressure0_input';

// We will initialize the driver for the BMP085 sensor located at I2C location 0x77
// b.writeTextFile(iic + 'new_device', 'bmp085 0x77');// Load sensor when start up


// Opens,reads, and prints pressure and temperature
// b.readTextFile(pressure, printPressure);
// b.readTextFile(temperature, printTemperature); 

// Prints Pressure
// function printPressure(x) {
//   console.log("Pressure: ", x.data/100 + " millibar");
//}

// Prints Temperature
/*
function printTemperature(x) {
   // '\xB0' is the degree symbol in hexademical
   console.log("Temperature: ", x.data/10 + '\xB0' + " Celcius");
   x.data /= 10;
//   x.data *= 1.8; // Convert to Fahrenheit
 //  x.data += 32;
//   console.log("or: ", x.data + '\xB0' + " Fahrenheit"); 
}


*/
function getTemperature(x){
	return "Temperature: "+ x.data/10 + "\xB0" + " Celcius";
}

var convertTemper = function(d) {
  return d.data/10;
};
// ======================
// Automatic Datalogger
// arg: a logger Object
// return: true / false, loger state:start or stop
// ======================
var autoLogger = function( logger ){
  var interval = 10000; // milis, log writer interval
  var tHook = 0; // 0 -> autologger not started, !0 -> autologger started 

  var reLog = function() {
	tHook = setTimeout(
	  function(){
		b.readTextFile(temperature, function(e){
		  logger.add(convertTemper(e));
		});
		reLog(); // recursive
	  },
	  interval
	);
  };

  this.state = function(){
    return tHook === 0 ? false : true; // hook of the setTimeout(), in order to decide there is a automatic logger or not
  }	

  this.start = function(){
	reLog();
  }

  this.stop = function(){
  	clearTimeout(tHook);
	tHook = 0;
  }
}

// Each init of a logger module should pass the name of the file. The module will handle the existence of the file.
var log = new logger({fName:"exist.txt"}); 
var aLogger = new autoLogger( log ); // Init autologger

aLogger.start(); // Start logging. // TODO: Prevent multi-start aLogger. Build this into autoLogger class!!!
aLogger.state(); // get state of the autoLogger
// aLogger.stop(); // stop logging. 
/*
console.log("aLogger state now: ", aLogger.state());
console.log("start autoLogger:", aLogger.start());
console.log("aLogger state now: ", aLogger.state());
setTimeout(
  function(){
	aLogger.stop();
	setTimeout(function(){
	  console.log("aLogger state now: ", aLogger.state());
	},1000);	  
  }, 5000);
// setTimeout(function(){log.add("Hallo logger.")}, 1000);
*/
// log.read("exist.txt");

