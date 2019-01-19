"use strict";

var GitIgnore = require('./library');
var fs = require('fs');
var OS = require('os');

(function() {
  var types = process.argv.slice(2);

  if (!types || types.length === 0) {
    console.log("Usage: gitignore [PROJECT TYPE]");
    console.log("Example: gitignore rails");
    console.log("Available project types can be found by running `gitignore -types` or at https://github.com/github/gitignore");
    return;
  }

  if (/^((--?)?types|-t)$/i.test(types.join())) {
    console.log("Fetching available types...");
    GitIgnore.getTypes(function(err, types){
      if(err){
        if(err.statusCode){
          console.error("Could not access file from GitHub. Recieved status code "+err.statusCode);
        } else {
          console.error("An unexpected error occurred.");
          console.error(err);
        }
        return;
      }
      console.log(types.join(OS.EOL));
    });
  } else {
    types.forEach(function(type) {
      type = type.charAt(0).toUpperCase() + type.slice(1);
      let file = fs.createWriteStream(".gitignore", { 'flags': 'a' });
      if (/--\w/.test(type)) {
        GitIgnore.writeFlag({
          flag: type,
          file: file
        }, function (err) {
          if (err) {
            if (err.statusCode) {
              console.log("There is no gitignore for flag" + type);
              console.error("Error code " + err.statusCode);
            } else {
              console.error("An unexpected error occurred.");
              console.error(err);
            }
            return;
          }          
        });
      }
      else {
        GitIgnore.writeFile({
          type: type,
          file: file
        }, function(err){
          if(err){
            if(err.statusCode){
              console.log("There is no gitignore for " + type);
              console.log("Available project types can be found by running `gitignore -types` or at https://github.com/github/gitignore");
              console.error("Recieved status code "+err.statusCode);
            } else {
              console.error("An unexpected error occurred.");
              console.error(err);
            }
            return;
          }
        });
      }
    });
    console.log(`Created .gitignore file for flag type ${types}.`);
  }

}).call(this);
