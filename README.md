# WRLD Metaverse Authentication APIs - mv-auth

:warning: This service is under development and has not yet been fully reviewed or tested for use in production. :warning:

## Requirements

- npm (node:15.14.0 tested)

## Development

1. Run `npm install`
2. Set the environment variables
   - DATABASE_URL: <DATABASE_URL>
   - DEV_DATABASE_URL: <DEV_DATABASE_URL>
   - NODE_ENV: <NODE_ENV>
   - APP_PORT: <APP_PORT>
   - JWT_TOKEN_EXPIRY: <JWT_TOKEN_EXPIRY>
   - JWT_TOKEN_KEY: <JWT_TOKEN_KEY>
   - NONCE_KEY: <NONCE_KEY>
   - CRYPT_KEY: <CRYPT_KEY>
   - REDIS_KEY_EXPIRY: <REDIS_KEY_EXPIRY>
   - REDIS_URL: <REDIS_URL>
3. Run `npm run start`

## Production builds

1. Set the environment variables

   - DATABASE_URL: <DATABASE_URL>
   - DEV_DATABASE_URL: <DEV_DATABASE_URL>
   - NODE_ENV: <NODE_ENV>
   - APP_PORT: <APP_PORT>
   - JWT_TOKEN_EXPIRY: <JWT_TOKEN_EXPIRY>
   - JWT_TOKEN_KEY: <JWT_TOKEN_KEY>
   - NONCE_KEY: <NONCE_KEY>
   - CRYPT_KEY: <CRYPT_KEY>
   - REDIS_KEY_EXPIRY: <REDIS_KEY_EXPIRY>
   - REDIS_URL: <REDIS_URL>

2. Run `docker file in EKS folder`

This will build a docker container and deploy the application into that container and will trigger to run the application.

## APIs

### https://staging-gateway.wrld.xyz/auth/signUp?csrf-bypass=true

This api is used to sign up a user and create a user if not already exists and returns the user information with nonce which will be used in the login service for authentication.

#### method

POST

#### input json

{
"providerKey":"0x6ebb625b6dc64614d87fa978e6fa7756843775b9",
"providerType":"wallet"
}

#### output json

{
"data": {
"userId": 1,
"providerId": 1,
"userScreenName": null,
"email": null,
"nonce": 912354
},
"success": true
}

### https://staging-gateway.wrld.xyz/auth/login?csrf-bypass=true

This api is used to authenticate that the user who signed up is a valid user with proper signature generated from the frontend. Once user signature is matched then a JWT is issued to access further APIs.

#### method

POST

#### input json

{
"providerKey":"0x6ebb625b6dc64614d87fa978e6fa7756843775b9",
"providerType":"wallet",
"signature": "0x65cb747a9b558eb7f8e8ea2b979c2bc4d0038931a078ea71348555698c7e2be90d4e2113b8eff0f5ab2b724c9d1569637127f811e55e635b6ae601853e3918311c"
}

#### output json

{
"data": {
"userId": 1,
"providerId": 1,
"userScreenName": null,
"email": null,
"token": "GT.78ea71348555698c7e2be90d4e2113b8eff0f5ab2b724c9d1569637127f811e5.jduud"
},
"success": true
}

### https://staging-gateway.wrld.xyz/users/GetUserbySessionToken/?csrf-bypass=true

This api is used to return the user information based on the token passed in the cookie

#### method

GET

#### input json

N/A

#### output json

{
"data": {
"id": 11,
"userScreenName": "Farhan Zia-999",
"email": null,
"createdBy": null,
"updatedBy": null,
"createdAt": "2022-05-16T10:02:08.290Z",
"updatedAt": "2022-05-18T15:38:23.392Z"
},
"success": true
}

### https://staging-gateway.wrld.xyz/users/UpdateUserScreenName/1?csrf-bypass=true

This api updates the user screen name

#### method

PUT

#### input json

{
"userScreenName":"Farhan Zia-999"
}

#### output json

{
"data": {
"userScreenName": "Farhan Zia-999"
},
"success": true
}

## License

This application is licensed under the terms of the Master Software License and Professional Services agreement between WRLD3D Ltd. and E&S Ring Management dated 5-Oct-2021. See the [LICENSE.md](LICENSE.md) file for details.
