export const msalConfig = {
    auth: {
        clientId: "b93a80b4-b045-4220-99ac-f5120c3042d2",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};
