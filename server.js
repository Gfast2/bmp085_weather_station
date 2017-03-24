var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var b = require('bonescript');
var logger = require('./logger');

http.createServer(function (req, res) {
//  console.log("req.method:" + req.method);
//  console.log("req.url:" + req.url);
//  console.log("req.header:" + req.header);

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
				res.write('</body>');
				res.write('</html>');
				res.end();
			}); 
		break;
	default:
		res.writeHead(200, {'Content-Type': 'text/html'});
	 	res.end(index);
  }

}).listen(8082);

console.log("Yes, the Webserver is online: port: 8082");

// Testing stuffs

var bus = 1;
// uncomment if using SeeedStudio Grove sensor
// bus = 2;
// var iic = '/sys/class/i2c-adapter/i2c-' + bus + '/';

//Sensor Locations on the BeagleBone Black
var temperature = '/sys/bus/i2c/drivers/bmp085/' + bus + '-0077/temp0_input';
var pressure = '/sys/bus/i2c/drivers/bmp085/' + bus + '-0077/pressure0_input';

// We will initialize the driver for the BMP085 sensor located at I2C location 0x77
// b.writeTextFile(iic + 'new_device', 'bmp085 0x77');

// Opens,reads, and prints pressure and temperature
b.readTextFile(pressure, printPressure);
b.readTextFile(temperature, printTemperature); 

// Prints Pressure
function printPressure(x) {
   console.log("Pressure: ", x.data/100 + " millibar");
}

// Prints Temperature
function printTemperature(x) {
   // '\xB0' is the degree symbol in hexademical
   console.log("Temperature: ", x.data/10 + '\xB0' + " Celcius");
   x.data /= 10;
   x.data *= 1.8;
   x.data += 32;
   console.log("or: ", x.data + '\xB0' + " Fahrenheit"); 
}

function getTemperature(x){
	return "Temperature: "+ x.data/10 + "\xB0" + " Celcius";
}

// some loging control snippet
// var stream = fs.createWriteStream("./my_file.txt");
// stream.once('open', function(fd){
// 	stream.write("My first row\n");
// 	stream.write("My second row\n");
//	stream.end(); // If this loging is not finished (closed), The logged file is still there. 
// });

var log = new logger({fName:"exist.txt"}); // Each init of a logger module should pass the name of the file. The module will handle the existence of the file.


setTimeout(function(){log.add("Hallo logger.")}, 1000);

console.log("Right now start read data.");

log.read("exist.txt");


console.log("Finish write file content to the console.");
