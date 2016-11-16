const fs = require('fs');
const _ = require('lodash');

/**
 * file contents should be like:
 * <HTTP href><whitespace><filename, under which file should be saved locally>
 */

const read = (path) => {
    return fs.readFileSync(path, 'utf8');
};

const parse = (content) => {
    return content
        .split('\n')
        .filter( el => {
            return el !== '';
        });
};

const contentToObjects = (parsedContent) => {
    return parsedContent.map( el => {
        let splitted = el.split(' ');
        return {href: splitted[0], names: [splitted[1]]};
    });
};

const mergeSameHrefsFilenames = (objects) => {

    let o = objects.reduce((prev, current, index, array) => {
        let match = _.findIndex(prev, (el) => {return el.href == current.href;});
        if(match >= 0){
            prev[match].names = prev[match].names
                .concat(current.names)
                .filter(name => { return !!name; });

            prev[match].names = _.uniq(prev[match].names);

            return prev;
        } else {

            return prev.concat(current);
        }
    }, []);
    return o;
};

module.exports.getParsedContent = (path) => {
    return mergeSameHrefsFilenames( contentToObjects( parse( read(path) ) ) );
};
