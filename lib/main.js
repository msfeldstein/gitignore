(function() {
  var https = require('https');
  var fs = require('fs');
  var type = process.argv[2];
  type = type.charAt(0).toUpperCase() + type.slice(1);
  var file = fs.createWriteStream(".gitignore");
  https.get("https://raw2.github.com/github/gitignore/master/" + type + ".gitignore", function(res) {
    res.pipe(file);
  });
}).call(this)