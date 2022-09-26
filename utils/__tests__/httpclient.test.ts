const httpClient = require('../httpclient');
import {ApiError} from '../../utils/ApiError';
import axios from "axios";
import httpStatusCodes from 'http-status-codes';

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const errMsg = new ApiError(httpStatusCodes.SERVICE_UNAVAILABLE, "Network Error",httpStatusCodes.SERVICE_UNAVAILABLE);

const resErrMsg =  { 
  data:{
    error:{
      "code": httpStatusCodes.SERVICE_UNAVAILABLE,
      "message": "Network Error",
    }
}};


const responseErrMsg: any =new ApiError(httpStatusCodes.SERVICE_UNAVAILABLE, "Network Error",httpStatusCodes.SERVICE_UNAVAILABLE);
//embedding the response object with error message
responseErrMsg.response = resErrMsg;

const options = {
  timeout: (1000),
  headers: { 'Content-Type': 'application/json' },
};

const jsonData = { 
  "id": 1,
  "test": "testMessage",
};


mockedAxios.get.mockResolvedValue({data: [
  {
      "id": 1,
      "test": "testMessage",
  }] });

mockedAxios.post.mockResolvedValue({data: [
  {
      "id": 1,
      "test": "testMessage",
  }] });

mockedAxios.put.mockResolvedValue({data: [
{
    "id": 1,
    "test": "testMessage",
}] });

mockedAxios.patch.mockResolvedValue({data: [
{
    "id": 1,
    "test": "testMessage",
}] });    
describe('httpClient method testing', () => {
  afterEach(jest.clearAllMocks);

  test('check the get method of client', async () => {
    const response = await httpClient.get("test");
    expect(response).not.toBe(null);

  });

  test('check the get method of client by passing options', async () => {
    const response = await httpClient.get("test",options);
    expect(response).not.toBe(null);

  });

  test('check the get method of client with error generation 1', async () => {
    try {
        mockedAxios.get.mockRejectedValue(errMsg);

        await httpClient.get("test");
    } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
      expect(e.message).toEqual("Network Error");
    }
  });

  test('check the get method of client with error generation 2', async () => {
    try {

        mockedAxios.get.mockRejectedValue(responseErrMsg);

        await httpClient.get("test");
    } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
    }
  });

  test('check the post method of client', async () => {
    const response = await httpClient.post("test");
    expect(response).not.toBe(null);
  });

  test('check the post and jsonData method of client by passing options', async () => {

    const response = await httpClient.post("test",jsonData,options);
    expect(response).not.toBe(null);

  });

  test('check the post method of client with error generation 1', async () => {
    try {
        mockedAxios.post.mockRejectedValue(errMsg);

        await httpClient.post("test");
    } catch (e) {
        expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
        expect(e.message).toEqual("Network Error");
    }
  });

  test('check the post method of client with error generation 2', async () => {
    try {

        mockedAxios.post.mockRejectedValue(responseErrMsg);

        await httpClient.post("test");
    } catch (e) {
        expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
    }
  });

  test('check the patch method of client', async () => {
    const response = await httpClient.patch("test");
    expect(response).not.toBe(null);
  });

  test('check the patch and jsonData method of client by passing options', async () => {
    const response = await httpClient.patch("test",jsonData,options);
    expect(response).not.toBe(null);

  });

  test('check the patch method of client with error generation 1', async () => {
    try {
        mockedAxios.patch.mockRejectedValue(errMsg);

        await httpClient.patch("test");
    } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
      expect(e.message).toEqual("Network Error");
  }
});

test('check the patch method of client with error generation 2', async () => {
  try {

      mockedAxios.patch.mockRejectedValue(responseErrMsg);

      await httpClient.patch("test");
  } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
  }
});

  test('check the put method of client', async () => {
    const response = await httpClient.put("test");
    expect(response).not.toBe(null);
  });

  test('check the put and jsonData method of client by passing options', async () => {
    const response = await httpClient.put("test",jsonData,options);
    expect(response).not.toBe(null);

  });

  test('check the put method of client', async () => {
    const response = await httpClient.put("test");
    expect(response).not.toBe(null);
  });

  test('check the put method of client with error generation', async () => {
    try {
        mockedAxios.put.mockRejectedValue(errMsg);

        await httpClient.put("test");
    } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
      expect(e.message).toEqual("Network Error");
  }
});

test('check the put method of client with error generation 2', async () => {
  try {

      mockedAxios.put.mockRejectedValue(responseErrMsg);

      await httpClient.put("test");
  } catch (e) {
      expect(e.code).toEqual(httpStatusCodes.SERVICE_UNAVAILABLE);
  }
});

});
