import * as fs from 'fs'
import * as AWS from 'aws-sdk'
import * as archiver from 'archiver'
import { BODY_UPLOAD_FILE_TO_S3 } from '../interface';
import { MONGO_STREAMS } from './streams';


const uploadStreamToS3 = async (opts: BODY_UPLOAD_FILE_TO_S3, stream: any) => {
    const s3 = new AWS.S3({
        signatureVersion: opts.s3.signatureVersion,
        region: opts.s3.region,
        accessKeyId: opts.s3.accessKeyId,
        secretAccessKey: opts.s3.secretAccessKey,
    });
    return await s3.upload({
        Body: stream,
        Bucket: opts.s3.bucket,
        Key: `${opts.s3.folder}/${new Date().valueOf()}.zip`,

    }).promise();
}


export const MONGO_DUMP = async (opts: BODY_UPLOAD_FILE_TO_S3) => {
    var archive = archiver.create("zip", {});
    const data = await MONGO_STREAMS(opts)
    data.map(item => {
        console.log(item)
        return archive.append(fs.createReadStream(item.path), {
            name: item.name,
        });
    })
    archive.finalize();
    return await uploadStreamToS3(opts, archive);
};
