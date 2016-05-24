"use strict";

var https = require('https');

var GitIgnore = {};

GitIgnore.getTypes = function(callback){
  var types = [];
  https.get({host: "api.github.com", path: "/repos/github/gitignore/contents", headers: {"User-Agent": "gitignore node app"}}, function(res) {
    if (res.statusCode !== 200) {
      var err = new Error("somethingWentWrong");
      err.statusCode = res.statusCode;
      return callback(err);
    }
    var body = "";
    res.on("data", function(chunk) {
      body += chunk;
    });
    res.on("end", function() {
      var json = JSON.parse(body);
      for(var i = 0; i < json.length; ++i) {
        var name = json[i].name;
        var cleanName = name.substr(0, name.indexOf('.'));
        if (cleanName.length > 0 && name.match(/\.gitignore$/)){
          types.push(cleanName);
        }
      }
      callback(null, types);
    });
  }).on("error", callback);
};

GitIgnore.writeFile = function(options, callback){
  if(!options.type){
    return callback(new Error("noTypeProvided"));
  }
  if(!options.file && !options.writable){
    return callback(new Error("noWritableProvided"));
  }
  https.get("https://raw.githubusercontent.com/github/gitignore/master/" + options.type + ".gitignore", function(res) {
    if (res.statusCode !== 200) {
      var err = new Error("typeDoesNotExist");
      err.statusCode = res.statusCode;
      return callback(err);
    }
    res.pipe(options.file || options.writable);
    return callback();
  }).on("error", callback);
};

module.exports = GitIgnore;
