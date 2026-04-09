export const msalConfig = {
  auth: {
    clientId: '9445d18c-ef16-479a-be00-0846553b5dba',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowNativeBroker: false,
  }
}

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'Mail.Read', 'User.Read'],
  prompt: 'select_account',
}

export const mailRequest = {
  scopes: ['Mail.Read'],
}