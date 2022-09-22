import axios from 'axios';
import Logger from '../config/logger';
const DEFAULT_TIMEOUT = parseInt(process.env.HTTP_CLIENT_TIMEOUT) || 10000;

const defaultOptions = {
  timeout: DEFAULT_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
};
const get = async (endpointNameOrUrl: string, options: any = undefined) => {
  try {
    let response: any = null;

    if (options && Object.keys(options).length !== 0) response = await axios.get(endpointNameOrUrl, options);
    else response = await axios.get(endpointNameOrUrl, defaultOptions);

    Logger.info(`HttpClient-get() - Success Response received from: ${endpointNameOrUrl} endpoint`);
    Logger.debug(response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      Logger.error(error.response.data.error);
      Logger.error(
        `HttpClient-get() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.response.data.error.code} - ${error.response.data.error.message}`,
      );
      throw error.response.data.error;
    } else {
      Logger.error(error.message);
      Logger.error(
        `HttpClient-get() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`,
      );
      throw error;
    }
  }
};

const post = async (endpointNameOrUrl: string, dataJson = {}, options: any = undefined) => {
  try {
    let response: any = null;

    if (options && Object.keys(options).length !== 0) response = await axios.post(endpointNameOrUrl, dataJson, options);
    else response = await axios.post(endpointNameOrUrl, dataJson, defaultOptions);

    Logger.info(`HttpClient-post() - Success Response received from: ${endpointNameOrUrl} endpoint`);
    Logger.debug(response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      Logger.error(error.response.data.error);
      Logger.error(
        `HttpClient-post() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.response.data.error.code} - ${error.response.data.error.message}`,
      );
      throw error.response.data.error;
    } else {
      Logger.error(error.message);
      Logger.error(
        `HttpClient-post() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`,
      );
      throw error;
    }
  }
};

const put = async (endpointNameOrUrl: string, dataJson = {}, options: any = undefined) => {
  try {
    let response: any = null;

    if (options && Object.keys(options).length !== 0) response = await axios.put(endpointNameOrUrl, dataJson, options);
    else response = await axios.put(endpointNameOrUrl, dataJson, defaultOptions);

    Logger.info(`HttpClient-put() - Success Response received from: ${endpointNameOrUrl} endpoint`);
    Logger.debug(response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      Logger.error(error.response.data.error);
      Logger.error(
        `HttpClient-put() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.response.data.error.code} - ${error.response.data.error.message}`,
      );
      throw error.response.data.error;
    } else {
      Logger.error(error.message);
      Logger.error(
        `HttpClient-put() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`,
      );
      throw error;
    }
  }
};

const patch = async (endpointNameOrUrl: string, dataJson = {}, options: any = undefined) => {
  try {
    let response: any = null;

    if (options && Object.keys(options).length !== 0)
      response = await axios.patch(endpointNameOrUrl, dataJson, options);
    else response = await axios.patch(endpointNameOrUrl, dataJson, defaultOptions);

    Logger.info(`HttpClient-patch() - Success Response received from: ${endpointNameOrUrl} endpoint`);
    Logger.debug(response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      Logger.error(error.response.data.error);
      Logger.error(
        `HttpClient-patch() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.response.data.error.code} - ${error.response.data.error.message}`,
      );
      throw error.response.data.error;
    } else {
      Logger.error(error.message);
      Logger.error(
        `HttpClient-patch() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`,
      );
      throw error;
    }
  }
};

// const delete = async (endpointNameOrUrl:String, dataJson = {}) => {

//     try {
//         const response = await axios.delete(endpointNameOrUrl, dataJson,options);
//         Logger.info(`HttpClient-delete() - Success Response received from: ${endpointNameOrUrl} endpoint`);
//         Logger.debug(response.data);
//     } catch (error) {
//         Logger.error(error.response);
//         Logger.info(`HttpClient-delete() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`);
//         throw error;
//     }
// }

export { get, post, put, patch };
