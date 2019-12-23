global.electron = require('electron')
global._path = require('path')
global._os = require('os')
global.dir_name = __dirname;
global.pip_service_path = global._path.join(global.dir_name, 'pip_service')
global.__EOL__ = global._os.EOL