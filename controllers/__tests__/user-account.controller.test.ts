import { app, redisClient } from '../../app';
const supertest = require('supertest');
import jwt from 'jsonwebtoken';
import sequelize from '../../config/database';
import httpStatusCodes from 'http-status-codes';
import { Provider } from 'utils/enums';
import helperFunctions from '../../utils/helper';
const userAccount = require('../../models/user-account.model');
const providerAccount = require('../../models/provider-account.model');
describe('test user account services', () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  let thisDb: any = sequelize;
  let userId: number;

  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeAll(async () => {
    await thisDb.sync({ force: true });

    // create mock data in order to test the services
    const loginUser = await userAccount.create({
      userScreenName: 'Farhan Zia',
    });

    // Add in providerAccount table
    await providerAccount.create({
      userAccountId: loginUser.id,
      providerType: Provider.Wallet,
      providerKey: helperFunctions.encrypt(Buffer.from('0x6ebb625b6dc64614d87fa978e6fa7756843775b9', 'utf8')),
    });
  });

  test('POST /auth/signUp sign up for user by missing providerType to generate validator error', async () => {
    const response = await supertest(app)
      .post('/auth/signUp/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
      })
      .expect(httpStatusCodes.UNPROCESSABLE_ENTITY);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  test('POST /auth/signUp sign up for user by passing invalid provider to generate validator error', async () => {
    const response = await supertest(app)
      .post('/auth/signUp/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'microsoft',
      })
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.BAD_REQUEST);
  });

  test('POST auth/signUp sign up for user by passing invalid provider to generate validator error for google', async () => {
    const response = await supertest(app)
      .post('/auth/signUp/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'google',
      })
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.BAD_REQUEST);
  });

  test('POST auth/signUp sign up for user by passing invalid provider to generate validator error for google', async () => {
    const response = await supertest(app)
      .post('/auth/signUp/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'wallet',
        userScreenName:
          'Farhan Zia121122323232343434343434354545456566745454541211223232323434343434343545454565667454545412112232323234343434343435454545656674545454',
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('POST auth/signUp sign up for user with valid data', async () => {
    const response = await supertest(app)
      .post('/auth/signUp/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'wallet',
      })
      .expect(httpStatusCodes.OK);

    expect(response.body).toMatchObject({
      success: true,
    });

    userId = response.body.data.userId;
    expect(userId).toBeTruthy();
  });

  test('POST auth/login login for user with valid data', async () => {
    //set the redis cache with hardcoded nonce
    await redisClient.set('0x6ebb625b6dc64614d87fa978e6fa7756843775b9', 886900);
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0x6ebb625b6dc64614d87fa978e6fa7756843775b9',
        providerType: 'wallet',
        signature:
          '0x65cb747a9b558eb7f8e8ea2b979c2bc4d0038931a078ea71348555698c7e2be90d4e2113b8eff0f5ab2b724c9d1569637127f811e55e635b6ae601853e3918311c',
      })
      .expect(httpStatusCodes.OK);

    expect(response.body).toMatchObject({
      success: true,
    });
  });

  test('POST auth/login login for user with no nonce', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0x6ebb625b6dc64614d87fa978e6fa7756843775b9',
        providerType: 'wallet',
        signature:
          '0x65cb747a9b558eb7f8e8ea2b979c2bc4d0038931a078ea71348555698c7e2be90d4e2113b8eff0f5ab2b724c9d1569637127f811e55e635b6ae601853e3918311c',
      })
      .expect(httpStatusCodes.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      success: false,
    });
  });

  test('POST /auth/login login for user by missing providerType to generate validator error', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
      })
      .expect(httpStatusCodes.UNPROCESSABLE_ENTITY);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  test('POST /auth/login login for user by passing invalid provider to generate validator error', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'microsoft',
      })
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.BAD_REQUEST);
  });

  test('POST auth/login sign up for user by passing invalid provider to generate validator error for google', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'google',
      })
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.BAD_REQUEST);
  });

  test('POST auth/login by skipping signature for user', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'wallet',
      })
      .expect(httpStatusCodes.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.UNAUTHORIZED);
  });

  test('POST auth/login login for user with invalid signature', async () => {
    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: '0xae9BCc7c9499AF8eF8df26832840dfC5c319cfcF',
        providerType: 'wallet',
        signature:
          '0x10e12b955a5dd465364b9afc86485b5060665cde17609d49e0d6b592e528e63a0425ddc5cf8d3e9b486670c1b47ac0620e257d8106321be96b5cad56ba4620401c',
      })
      .expect(httpStatusCodes.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      success: false,
    });
    expect(response.body.error.message).toEqual('signature verification failed.');
  });

  test('POST auth/login login for user with invalid provider key', async () => {
    //set the redis cache with hardcoded nonce
    await redisClient.set('invalidKey', 886900);

    const response = await supertest(app)
      .post('/auth/login/?csrf-bypass=true')
      .send({
        providerKey: 'invalidKey',
        providerType: 'wallet',
        signature:
          '0x10e12b955a5dd465364b9afc86485b5060665cde17609d49e0d6b592e528e63a0425ddc5cf8d3e9b486670c1b47ac0620e257d8106321be96b5cad56ba4620401c',
      })
      .expect(httpStatusCodes.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      success: false,
    });
    expect(response.body.error.message).toEqual('invalid login credentials.');
  });

  test('GET /auth/expire-cookies will delete all cookies', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/auth/expire-cookies/?csrf-bypass=true`)

      .expect(httpStatusCodes.OK);

    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.headers['set-cookie'][0]).toEqual('token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(response.headers['set-cookie'][1]).toEqual('_csrf=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  test('GET /auth/csrf-token should return csrf-token', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/auth/csrf-token`)

      .expect(httpStatusCodes.OK);

    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.body.data.csrfToken.length).toEqual(36);
  });

  test('GET /users/getUserBySessionToken should return user against session token ', async () => {
    //creating jwt
    const jwtToken = jwt.sign(
      {
        userId: '1',
      },
      'mv-auth',
      { expiresIn: '1h' },
    );

    const origin = 'http://localhost:3000';
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/users/getUserBySessionToken/?csrf-bypass=true`)
      .set({
        origin: 'https://www-staging.wrld.xyz',
        cookie: `token=${jwtToken}`,
      })
      .expect(httpStatusCodes.OK);

    expect(response.body).toBeTruthy();
    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.body.data.userScreenName).toEqual('Farhan Zia');
  });

  test('GET /users/getUserBySessionToken should not return any user against invalid user id', async () => {
    //creating jwt
    const jwtToken = jwt.sign(
      {
        userId: 2920192029,
      },
      'mv-auth',
      { expiresIn: '1h' },
    );

    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/users/getUserBySessionToken/?csrf-bypass=true`)
      .set({
        cookie: `token=${jwtToken}`,
      })
      .expect(httpStatusCodes.BAD_REQUEST);
    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.message).toEqual('no user found against id:2920192029.');
  });

  test('GET /users/getUserBySessionToken should generate error of invalid jwt Token', async () => {
    //creating jwt
    const jwtToken = jwt.sign(
      {
        userId: 2920192029,
      },
      'invalideSecurityKey',
      { expiresIn: '1h' },
    );

    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/users/getUserBySessionToken/?csrf-bypass=true`)
      .set({
        cookie: `token=${jwtToken}`,
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.message).toEqual('Not authenticated.');
  });

  test('GET /users/getUserBySessionToken not passing jwt token as cookie should return error', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/users/getUserBySessionToken/?csrf-bypass=true`)

      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });
  });

  test('GET /users/createAndGetUsersWithProviderTypeandKeys creating and getting users with provider type and keys', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .post(`/users/createAndGetUsersWithProviderTypeandKeys/?csrf-bypass=true`)
      .send({
        providerType: 'wallet',
        providerKeys: ['0x0000000000000000000000000000000000000000', '0x6EBB625B6dc64614D87fa978e6fA7756843775b9'],
      })
      .expect(httpStatusCodes.OK);

    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
  });

  test('GET /users/createAndGetUsersWithProviderTypeandKeys passing no provider type should generate error', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .post(`/users/createAndGetUsersWithProviderTypeandKeys/?csrf-bypass=true`)
      .send({
        providerKeys: ['0x0000000000000000000000000000000000000000', '0x6EBB625B6dc64614D87fa978e6fA7756843775b9'],
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.message).toEqual("Cannot read property 'providerKey' of undefined");
  });

  test('GET /users/createAndGetUsersWithProviderTypeandKeys passing no provider keys should generate error', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .post(`/users/createAndGetUsersWithProviderTypeandKeys/?csrf-bypass=true`)
      .send({
        providerType: 'wallet',
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.message).toEqual('providerKeys is not iterable');
  });

  test('GET /users/createAndGetUsersWithProviderTypeandKeys passing invalid provider type should generate error', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .post(`/users/createAndGetUsersWithProviderTypeandKeys/?csrf-bypass=true`)
      .send({
        providerType: 'someInvalidProviderType',
        providerKeys: ['0x0000000000000000000000000000000000000000', '0x6EBB625B6dc64614D87fa978e6fA7756843775b9'],
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.message).toEqual('value too long for type character varying(16)');
  });

  test('PUT /users/updateUserScreenName/:id should update status against generated id ', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .put(`/users/updateUserScreenName/${userId}?csrf-bypass=true`)
      .send({
        userScreenName: 'Farhan Zia',
      })
      .expect(httpStatusCodes.OK);

    expect(response.body).toBeTruthy();
    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.body.data.userScreenName).toEqual('Farhan Zia');
  });

  test('GET /auth/generate-jwt/:id should generate jwt token against user id ', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app).get(`/auth/generate-jwt/1?csrf-bypass=true`).expect(httpStatusCodes.OK);

    expect(response.body).toBeTruthy();
    expect(response.body).toMatchObject({
      success: true,
    });

    expect(response.body.data.jwtToken).toHaveLength(143);
  });

  test('GET /auth/generate-jwt/:id passing invalid id should generate error', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .get(`/auth/generate-jwt/5000?csrf-bypass=true`)
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.data).toBeUndefined();
  });

  test('PUT /users/updateUserScreenName/:id  passing invalid id should generate error ', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .put(`/users/updateUserScreenName/100?csrf-bypass=true`)
      .send({
        userScreenName: 'Farhan Zia',
      })
      .expect(httpStatusCodes.BAD_REQUEST);

    expect(response.body).toBeTruthy();
    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.BAD_REQUEST);
    expect(response.body.error.message).toEqual('no user found against id:100.');
  });

  test('PUT/users/updateUserScreenName/:id  not passing userScreenName should generate error ', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .put(`/users/updateUserScreenName/${userId}?csrf-bypass=true`)
      .send({
        userScreenName12: 'Farhan Zia',
      })
      .expect(httpStatusCodes.UNPROCESSABLE_ENTITY);

    expect(response.body).toBeTruthy();
    expect(response.body).toMatchObject({
      success: false,
    });
    expect(response.body.error.code).toEqual(httpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  test('PUT/users/updateUserScreenName/:id passing overlimit userScreenName to generate 500 error', async () => {
    const response = await supertest(app)
      .put(`/users/updateUserScreenName/${userId}?csrf-bypass=true`)
      .send({
        userScreenName:
          'Farhan Zia121122323232343434343434354545456566745454541211223232323434343434343545454565667454545412112232323234343434343435454545656674545454',
      })
      .expect(httpStatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toMatchObject({
      success: false,
    });

    expect(response.body.error.code).toEqual(httpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('GET /tenants/invalidServiceCall should return status 404', async () => {
    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .put('/tenants/invalidServiceCall/?csrf-bypass=true')
      .expect(httpStatusCodes.NOT_FOUND);

    expect(response.body).toMatchObject({
      success: false,
    });
  });

  // After all tersts have finished, close the DB connection
  afterAll(async () => {
    await thisDb.close();
    await redisClient.quit();
  });
});
