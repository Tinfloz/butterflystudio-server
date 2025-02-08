export const createEndpoint = (accountKey:string, saName:string):string => {
    if (!accountKey || !saName) throw new Error("Account key or Storage Account name cannot be undefined or null!");
    return `DefaultEndpointsProtocol=https;AccountName=${saName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
}