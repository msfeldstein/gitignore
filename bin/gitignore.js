#!/usr/bin/env node
import path form 'path';
import fs form 'fs';
let lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib/main.js');
require(lib)