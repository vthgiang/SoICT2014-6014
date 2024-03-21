const os = require('os');
exports.checkOS = () => {
    if (os.platform() === 'win32')
        return 1 // window
    else if (os.platform() === 'linux')
        return 2 // linux
    else if (os.platform() === 'darwin')
        return 3 // macos
}
