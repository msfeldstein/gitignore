#!/usr/bin/env node

const fs = require("fs");
const OS = require("os");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const globalTunnel = require("global-tunnel-ng");
const GitIgnore = require("../lib/library");

const args = [
  {
    name: "type",
    alias: "t",
    type: String,
    multiple: true,
    defaultOption: true,
    typeLabel: "[PROJECT TYPE]"
  },
  {
    name: "types",
    type: Boolean,
    defaultValue: false,
    description: "Retreive a list of available project types"
  },
  {
    name: "proxy",
    alias: "p",
    type: String,
    typeLabel: "[URL]",
    description: "The URL of a proxy server to use"
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this help message"
  }
];

const help = args =>
  console.log(
    commandLineUsage([
      {
        header: "Usage",
        content:
          "gitignore [PROJECT TYPE]\n\n" +
          "Available project types can be found by running `gitignore --types` or at https://github.com/github/gitignore"
      },
      {
        header: "Example",
        content: "gitignore rails"
      },
      {
        header: "Options",
        optionList: args.map(arg => ({
          name: arg.name,
          typeLabel: arg.typeLabel,
          description: arg.description
        }))
      }
    ])
  );

var options = {};

try {
  options = commandLineArgs(args);
} catch (err) {
  if (err.name == "UNKNOWN_OPTION") {
    console.error("\n  >>> %s <<<", err.message);
    help(args);
  } else {
    console.error(err);
  }

  return;
}

if (options.proxy) {
  process.env.HTTP_PROXY = options.proxy;
  process.env.HTTPS_PROXY = options.proxy;

  globalTunnel.initialize();
}

if (options.types) {
  console.log("Fetching available types...");

  GitIgnore.getTypes((err, types) => {
    if (err) {
      if (err.statusCode) {
        console.error(
          "Could not access file from GitHub. Recieved status code " +
            err.statusCode
        );
      } else {
        console.error("An unexpected error occurred.");
        console.error(err);
      }

      return;
    }

    console.log(types.join(OS.EOL));
  });
} else if (Array.isArray(options.type)) {
  options.type.map(type => {
    type = type.charAt(0).toUpperCase() + type.slice(1);

    GitIgnore.writeFile(
      {
        type: type,
        file: fs.createWriteStream(".gitignore", { flags: "a" })
      },
      err => {
        if (err) {
          if (err.statusCode) {
            console.log("There is no gitignore for " + type);
            console.log(
              "Available project types can be found by running `gitignore -types` or at https://github.com/github/gitignore"
            );
            console.error("Recieved status code " + err.statusCode);
          } else {
            console.error("An unexpected error occurred.");
            console.error(err);
          }

          return;
        }

        console.log("Created .gitignore file for type " + type + " :)");
      }
    );
  });
} else {
  help(args);
}
