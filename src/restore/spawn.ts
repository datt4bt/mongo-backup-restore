import { spawnSync } from 'child_process'
import { BODY_UPLOAD_FILE_TO_S3 } from '../interface'

const MongoURI = require('mongo-uri')


const createDumpArgs = (opts: BODY_UPLOAD_FILE_TO_S3, input: string) => {
    var args = [];
    var _hostInfo = opts.uri ? MongoURI.parse(opts.uri) : opts;
    var host = _hostInfo.ports[0]
        ? _hostInfo.hosts[0] + ":" + _hostInfo.ports[0]
        : _hostInfo.hosts[0];

    if (host) {
        args.push("-h", host);
    }
    if (_hostInfo.username) {
        args.push("-u", _hostInfo.username);
    }
    if (_hostInfo.password) {
        args.push("-p", _hostInfo.password);
    }
    if (_hostInfo.options) {
        if (_hostInfo.options.ssl === "true") {
            args.push("--ssl");
        }
        if (_hostInfo.options.authSource) {
            args.push("--authenticationDatabase", _hostInfo.options.authSource);
        }
    }
    args.push("-d", _hostInfo.database);
    args.push("-c", opts.collection);
    args.push(input);
    return args;
}

export const spawnMongoDump = async (opts: any, pathUnzip: string, _log: any) => {
    var log = _log === undefined ? console.log : _log;
    var fileName = opts.collection + ".json";
    log(`Restoring collection: ${opts.collection}`)
    var input = `${pathUnzip}/${fileName}`
    var args = createDumpArgs(opts, input);
    var mongoRestore = await spawnSync("mongoimport", args);
    if (mongoRestore.error) {
        log(`Error when restore collection ${opts.collection}: ${mongoRestore.error.message}`)
    }
    return {
        name: fileName,
        path: input,
    }
};
