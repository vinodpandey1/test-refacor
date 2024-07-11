import process from 'process';

const adminGatewayUrl = process.env.REACT_APP_ADMIN_GATEWAY_URL;
const clientId =  process.env.REACT_APP_ADMIN_IAM_APP_NAME;
console.log('adminGatewayUrl', adminGatewayUrl, {clientId})
export const options = {
    clientId,
    authorizationUri: `${adminGatewayUrl}/ui/login`,
    redirectUri: `${process.env.REACT_APP_PUBLIC_URL}/login/callback`,
};

export const getLoginRedirectUri = (state: string) => {
    const uri = `${options.authorizationUri}?client_id=${
        options.clientId}&redirect_uri=${
        options.redirectUri}&state=${state}`;
    console.log('getLoginRedirectUri()', uri);

    return uri;
};

