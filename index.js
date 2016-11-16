const fileReader = require('./fileReader');
const downloader = require('./downloader');
const commandLineArgs = require('command-line-args');
const optionDefinitions = require('./optionDefinitions');

console.time('Download time');

const args = commandLineArgs(optionDefinitions);

if(!args.file || !args.directory) {
    console.error('\n You have to specify the target directory and the file that contains the data for download\n');
    return;
}

const parsedObjects = fileReader.getParsedContent(args.file);
const folder = downloader.mkDirIfNotExists(args.directory);
const promises = downloader.downloadFiles(parsedObjects, folder);

downloader.printResults(promises);

// TODO: downloadFiles() forEach to map
