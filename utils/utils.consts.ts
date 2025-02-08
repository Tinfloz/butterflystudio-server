export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const JWT_EXPIRY = "5d";
export const GITHUB_REPO_API = "https://api.github.com/user/repos";
export const GITHUB_USER_API = "https://api.github.com/user";
export const DOC_INTEGRATIONS = ["DevOps", "GitHub"] as const;
export const DEFAULT_QUEUE_OPTIONS = {
    removeOnComplete: {
        age: 3600,
        count: 1000
    },
    removeOnFail: {
        age: 24 * 3600
    },
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000,
    }
} as const
export const GET_ACCESS_TOKEN_GITHUB = "https://github.com/login/oauth/access_token";