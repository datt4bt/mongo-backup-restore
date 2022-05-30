import { BODY_RESTORE } from '../interface';
import * as fs from 'fs'
import { spawnMongoDump } from './spawn';



const listCollections = async (pathUnzip: string) => {
    return await fs.readdirSync(pathUnzip).map(name => {
        return name.split('.')[0]
    })
}
export const MONGO_STREAMS = async (opts: BODY_RESTORE, pathUnzip: string) => {
    const collections = await listCollections(pathUnzip)
    const data = await Promise.all(collections.map(async (collection: any) => {
        const result = await spawnMongoDump({ uri: opts.uri, collection: collection }, pathUnzip, opts.log);
        return result
    }))
    await fs.rmSync(pathUnzip, { recursive: true, force: true });
    return data
};

