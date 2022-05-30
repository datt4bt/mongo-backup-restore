import { BODY_RESTORE, BODY_UPLOAD_FILE_TO_S3 } from "../interface";
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'
import * as AWS from 'aws-sdk'
import * as unzipper from 'unzipper'
import { MONGO_STREAMS } from "./streams";


const getFileS3 = async (opts: BODY_RESTORE, pathUnzip: string) => {
    const s3 = new AWS.S3({
        signatureVersion: opts.s3.signatureVersion,
        region: opts.s3.region,
        accessKeyId: opts.s3.accessKeyId,
        secretAccessKey: opts.s3.secretAccessKey,
    });
    return await s3.getObject({ Bucket: opts.s3.bucket, Key: opts.s3.key }).createReadStream().pipe(unzipper.Extract({ path: pathUnzip })).promise();
}


export const MONGO_RESTORE = async (opts: BODY_RESTORE) => {
    const date = new Date().valueOf().toString();
    const pathUnzip = path.join('/Users/dat/self/test/data', `${date}`);
    await fs.existsSync(pathUnzip) || fs.mkdirSync(pathUnzip);
    await getFileS3(opts, pathUnzip)
    return await MONGO_STREAMS(opts, pathUnzip);
};
