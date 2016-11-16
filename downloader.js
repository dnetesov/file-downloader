const download = require('download');
const fs = require('fs');

const checkDirectoryExists = (path) => {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports.mkDirIfNotExists = (directory) => {
    if(!checkDirectoryExists(directory)){
        fs.mkdirSync(directory);
    }
    return directory.substr(-1) == '/' ? directory : directory + '/';
};

module.exports.downloadFiles = (parsedObjects, directory) => {

    return parsedObjects.map((el) => {

        let promise = download(el.href);
        promise.then(data => {
            el.names.forEach( name => {
                fs.writeFileSync(directory + name, data);
            });
        });

        return promise;
    });

};

module.exports.printResults = (promises) => {
    Promise.all(promises).then(
        data => {
            console.timeEnd('Download time');
            let totalSize = data.reduce((prev, current) => {
                return prev + current.length / 1024;
            }, 0.0);
            console.log('Downloaded ' + data.length + ' files\n' +
                        'Total size: ' + totalSize + ' KB');
        },
        reason => {console.log(reason);}
    );
};
