(function() {
  var https = require('https');
  var fs = require('fs');
  var type = process.argv[2];
  if (!type) {
    console.log("Usage: gitignore [PROJECT TYPE]");
    console.log("Example: gitignore rails");
    console.log("Available project types can be found at https://github.com/github/gitignore");
    process.exit(1);
  }
  type = type.charAt(0).toUpperCase() + type.slice(1);
  var file = fs.createWriteStream(".gitignore", {'flags': 'a'});
  https.get("https://raw2.github.com/github/gitignore/master/" + type + ".gitignore", function(res) {
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
