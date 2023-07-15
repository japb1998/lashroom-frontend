import { Amplify, Auth } from 'aws-amplify';

export default () =>  { 
        Amplify.configure({
    Auth: {

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',


        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_XXVCqUZ6o',

        // OPTIONAL - Amazon Cognito Web IClient ID (26-char alphanumeric string)
        userPoolWebClientId: '4lmtl704f9sdpit34m5ruo27a6',

        // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
        // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
        signUpVerificationMethod: 'code', // 'code' | 'link'

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: window.location.hostname,
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
        oauth: {
        domain: 'lashroombyeli.auth.us-east-1.amazoncognito.com',
        scope: [
            'phone',
            'email',
            'openid',
            // 'aws.cognito.signin.user.admin',
            // 'profile',
        ],
        redirectSignIn: window.location.origin,
        redirectSignOut: window.location.origin,
        responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
        },
    });
}
