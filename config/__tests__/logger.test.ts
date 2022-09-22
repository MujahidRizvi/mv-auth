describe('testing logger', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    // once test is completed set the env node back to test
    afterAll(async () => {
        process.env.NODE_ENV="test";
      })

    test('should pass for development--setting NODE_ENV to empty', () => {
      
        process.env.NODE_ENV="";
        const Logger = require('../logger');
        const infoLog = Logger.info('Hello world');
    });
    test('should pass for other than development', () => {
            process.env.NODE_ENV="test";
            const Logger = require('../logger');
            const infoLog = Logger.info('Hello world');
    });
  });