export const msalConfig = {
    auth: {
        clientId: "b93a80b4-b045-4220-99ac-f5120c3042d2",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "https://jobapptracker-api-gjbjgfg3exfqfmex.westeurope-01.azurewebsites.net",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};
