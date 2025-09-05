export const msalConfig = {
    auth: {
        clientId: "b93a80b4-b045-4220-99ac-f5120c3042d2",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "https://mango-flower-04c2b6503.1.azurestaticapps.net",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};
