const lengthChecker = (s: string): boolean => {
    return s.trim().length === 0;
}

const getDevOpsUrl = (org: string, project: string): string => {
    return `https://dev.azure.com/${org}/${encodeURIComponent(project)}/_apis/git/repositories?api-version=7.1`
}

const getAuthHeadersGit = (t: string): { headers: { Authorization: string } } => {
    return {
        headers: {
            Authorization: `token ${t}`
        }
    }
}

const getAuthHeadersDevOps = (t: string): { headers: { Authorization: string } } => {
    return {
        headers: {
            Authorization: `Basic ${Buffer.from(':' + t).toString('base64')}`
        }
    }
}

const getBranchFetcherGit = (user: string, repo: string): string => {
    return `https://api.github.com/repos/${user}/${repo}/branches`
}

const getBranchFetcherDevOps = (org: string, project: string, repo: string): string => {
    return `https://dev.azure.com/${org}/${project}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads&api-version=7.1-preview.1`
}

export {
    lengthChecker,
    getDevOpsUrl,
    getAuthHeadersGit,
    getAuthHeadersDevOps,
    getBranchFetcherGit,
    getBranchFetcherDevOps
}