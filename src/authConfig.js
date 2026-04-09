export const msalConfig = {
  auth: {
    clientId: '9445d18c-ef16-479a-be00-0846553b5dba',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['Mail.Read', 'User.Read'],
}

export const mailRequest = {
  scopes: ['Mail.Read'],
}