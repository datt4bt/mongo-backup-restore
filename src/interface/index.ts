export interface BODY_UPLOAD_FILE_TO_S3 {
    s3: {
        signatureVersion: string,
        region: string,
        accessKeyId: string,
        secretAccessKey: string,
        bucket: string,
        folder: string,
    },
    collection?: string,
    log: object,
    uri: string,
}
export interface BODY_RESTORE {
    s3: {
        signatureVersion: string,
        region: string,
        accessKeyId: string,
        secretAccessKey: string,
        bucket: string,
        key: string,
    },
    collection?: string,
    log: object,
    uri: string,
}
