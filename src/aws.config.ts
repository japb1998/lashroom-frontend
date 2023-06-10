import { Amplify, Auth } from 'aws-amplify';

export default () =>  { 
        Amplify.configure({
    Auth: {

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',


        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_SB7MJKYNj',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',

        // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
        // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
        signUpVerificationMethod: 'code', // 'code' | 'link'

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: 'localstorage:4200',
        // OPTIONAL - Cookie path
        path: '/',
        // OPTIONAL - Cookie expiration in days
        expires: 365,
        // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        sameSite: 'strict',
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: true,
        },

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        // authenticationFlowType: 'USER_PASSWORD_AUTH',

        // // OPTIONAL - Hosted UI configuration
        // oauth: {
        // domain: 'your_cognito_domain',
        // scope: [
        //     'phone',
        //     'email',
        //     'profile',
        //     'openid',
        //     'aws.cognito.signin.user.admin',
        // ],
        // redirectSignIn: 'http://localhost:3000/',
        // redirectSignOut: 'http://localhost:3000/',
        // responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
        // },
        },
    });
}


// You can get the current config object
const currentConfig = Auth.configure();