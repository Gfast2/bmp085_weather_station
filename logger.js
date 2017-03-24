'use strict';

var fs = require('fs');

// Think about use other way!!
// https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback
module.exports =  function(parent) {

  var rootDir = './logFiles/';
  var fileName = parent.fName;
  console.log("logger module get inited! write to file:", rootDir + fileName);

  // append data to defined file.
  this.add = function(data){
	console.log("try to (if not exist, init it automatically) append stuff to the file.");
	fs.appendFile(
	  (rootDir+fileName), 
	  (Date.now() + "  " + data +  "\n"), 
	  {encoding:"utf8"},
	  function(){console.log("stuff appended.");}
	);
  }

  // return the content of a specified file
  this.read = function(data){

	var file = rootDir+data;
	
	console.log(file);
    fs.readFile(file,'utf8',
	  function(err, res){
		if(err){
		  return "File access got error.";
		}
		console.log(res);
		return res; //Content of this file.
	});

  };
};
