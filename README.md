# gitignore

Automatically fetch github's excellent `.gitignore` files for any of your new projects

[Here is the list of available types](https://github.com/github/gitignore)

## Use as a global utility

### Install

    npm install gitignore -g
    
Note: If **[NPX](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner)** (NPM's official package runner) is available in your environment you can use it to avoid a global install: ex. ```$ npx gitignore node``` is equivalent to ```npm i -g gitignore && gitignore node``` but avoids the global install step

### Usage

To list out all of the available types:

    gitignore -types

To create a `.gitignore` for rails:

    gitignore rails

That's it.

## Use programmatically as a module

### Install

    npm install gitignore

### and `require`

    var gi = require(`gitignore`);

## API

### `.getTypes(callback)`

Gets the types via `https` request to GitHub.

#### `callback(err, types)`

If an error occurred, or the request failed, an `Error` object is passed as the first parameter. If the types were successfully requested, an array of types is passed as the second parameter with `null` as the first.

### `.writeFile(options, callback)`

Gets the `.gitignore` file from GitHub of the specified `options.type` and stores it in the writable stream at `options.file` or `options.writable`.

#### `options`

`.type` (string) - The type associated with the `.gitignore` file to be fetched
`.file`, `.writable` (writable stream) - A writable stream (a file, sdtout, etc) that the results should be written to

#### `callback(err)`

If an error occurred or the request did not go through, an error obect is passed as the first parameter. If the request was successful, the first parameter is `null` or `undefined`.
