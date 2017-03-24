'use strict';

var fs = require('fs');

// Think about use other way!!
// https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback
module.exports =  function(parent) {

  var rootDir = './logFiles/';
  var fileName = parent.fName;
  console.log("logger module get inited! write to file:", rootDir + fileName);

  console.log("try to (if not exist, init it automatically) append stuff to the file.");

  fs.appendFile(
  	(rootDir+fileName), 
	(Date.now() + "  test Data\n"), 
	{encoding:"utf8"},
	function(){console.log("stuff appended.");}
  );

};
