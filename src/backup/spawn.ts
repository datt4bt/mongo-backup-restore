import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { spawnSync } from 'child_process'
import { BODY_UPLOAD_FILE_TO_S3 } from '../interface'

const MongoURI = require('mongo-uri')

/**
 * @param {Object} opts
 * @param {String} opts.collection
 * @param {String} [opts.uri]
 * @param {Array<String>} [opts.ports]
 * @param {Array<String>} [opts.hosts]
 * @param {String} [opts.username]
 * @param {String} [opts.password]
 * @param {String} [opts.database]
 * @returns {Array}
 */
const createDumpArgs = (opts: BODY_UPLOAD_FILE_TO_S3, output: string) => {
    console.log(output)
    var args = [];
    var _hostInfo = opts.uri ? MongoURI.parse(opts.uri) : opts;
    // We assume we connect to the first instance
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
    // Output (stdout)
    args.push("-o", output);

    return args;
}

export const spawnMongoDump = async (opts: any, _log: any) => {
    var log = _log === undefined ? console.log : _log;
    var fileName = opts.collection + ".json";

    var output = path.join(os.tmpdir(), fileName);
    var args = createDumpArgs(opts, output);
    var mongoDump = await spawnSync("mongoexport", args);
    if (mongoDump.error) {
        log(mongoDump.error.message)
    }
    return {
        name: fileName,
        path: output,
    }
};
