(function() {
  var https = require('https');
  var fs = require('fs');
  var type = process.argv[2];
  if (!type) {
    console.log("Usage: gitignore [PROJECT TYPE]");
    console.log("Example: gitignore rails");
    console.log("Available project types can be found at https://github.com/github/gitignore or by running `gitignore -types`");
    process.exit(1);
  }
  if (type == "-types") {
    console.log("Fetching available types...");
    json = https.get({host: "api.github.com", path: "/repos/github/gitignore/contents", headers: {"User-Agent": "gitignore node app"}}, function(res) {
      var body = "";
      res.on("data", function(chunk) {
        body += chunk;
      });
      res.on("end", function() {
        var typeJson = JSON.parse(body);
        for(var i = 0; i < typeJson.length; ++i) {
          var name = typeJson[i].name;
          var cleanName = name.substr(0, name.indexOf('.'));
          if (cleanName.length > 0)
            console.log(cleanName)
        }
      });
    });
    return;
  }
  type = type.charAt(0).toUpperCase() + type.slice(1);
  var file = fs.createWriteStream(".gitignore", {'flags': 'a'});
  https.get("https://raw.githubusercontent.com/github/gitignore/master/" + type + ".gitignore", function(res) {
    if (res.statusCode != 200) {
      console.log("There is no gitignore for " + type)
      console.log("Check https://github.com/github/gitignore for available types.");
      process.exit(1);
    }
    res.pipe(file);
    console.log("Created .gitignore :)");
  }).on("error", function(e) {
    console.log("Something went wrong... " + e)
  });
}).call(this)
