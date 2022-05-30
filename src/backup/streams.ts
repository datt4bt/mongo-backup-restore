import { BODY_UPLOAD_FILE_TO_S3 } from '../interface';
import { spawnMongoDump } from './spawn';
import { MongoClient } from 'mongodb';

const getDb = async (url: string) => {
    return await MongoClient.connect(
        url
    );
};


const listCollections = async (opts: BODY_UPLOAD_FILE_TO_S3) => {
    const client = await getDb(opts.uri)
    const collections = await client.db().listCollections().toArray()
    await client.close()
    return collections.map(collection => collection.name)
}


export const MONGO_STREAMS = async (opts: BODY_UPLOAD_FILE_TO_S3) => {
    const collections = await listCollections(opts)
    return await Promise.all(collections.map(async (collection: any) => {
        const result = await spawnMongoDump({ uri: opts.uri, collection: collection }, opts.log);
        return result
    }))
};
