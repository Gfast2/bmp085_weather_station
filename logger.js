'use strict';

var fs = require('fs');

// Think about use other way!!
// https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback
module.exports =  function(parent) {
	
	console.log("logger module get inited!");

	var fileName = parent.fileName;

	var stream = fs.createWriteStream("./my_file.txt");
	stream.once('open', function(fd){
	  stream.write("My first row\n");
	  stream.write("My second row\n");
//    stream.end(); // If this loging is not finished (closed), The logged file is still there.
	});

	this.append = function(data){
		stream.write( data + '\n');
		console.log("Append stream.");
	}

	this.finish = function(){
		stream.end();
		console.log("Close write stream.");
	}

};
