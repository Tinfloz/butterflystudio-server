import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } from "@azure/storage-blob"
import { resObjectMaker } from "./utils.response.instance";

const cleanedB64 = (b64:string):string => {
    if (b64.startsWith("data:")) return b64.split(",")[1];
    return b64
}

export const bulkUploads = async (endpoint: string, content: string[], fileNames: string[], mimeTypes: string[], accountName: string, accountKey: string): Promise<string[]> => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(endpoint);
        const containerClient = blobServiceClient.getContainerClient(process.env.GENERIC_CONTAINER!);
        const blockBlobClients = fileNames.map(el => containerClient.getBlockBlobClient(el));
        await Promise.all(blockBlobClients.map((el, ix) => el.uploadData(Buffer.from(cleanedB64(content[ix]), "base64"), {
            blobHTTPHeaders: {
                blobContentType: mimeTypes[ix]
            }
        })));
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 10);
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
        const sasUrls = blockBlobClients.map(el => {
            const sasToken = generateBlobSASQueryParameters({
                containerName: process.env.GENERIC_CONTAINER!,
                blobName: el.name,
                permissions: BlobSASPermissions.parse('r'),
                expiresOn: expiryDate,
                protocol: SASProtocol.Https
            }, sharedKeyCredential).toString();
            return `${el.url}?${sasToken}`;
        })
        return sasUrls;
    } catch (error) {
        console.error(error);
        throw resObjectMaker.getErrThrowResponseObject(500, "Could not upload files to blob")
    }
}