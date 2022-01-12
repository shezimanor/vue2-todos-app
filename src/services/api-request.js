import axios from 'axios';
// API response type contant
export const RESPONSE_TYPE = {
  CONNECT_CORRECT: 'CONNECT_CORRECT',
  CONNECT_ERROR: 'CONNECT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};
// create axios instance
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_PATH
});

export const apiClientSetToken = token => {
  apiClient.defaults.headers.common['Authorization'] = token;
};

const responseHandler = response => {
  // console.log('api-request resolve: ', response);
  const { headers, status, data } = response;
  return {
    responseType: RESPONSE_TYPE.CONNECT_CORRECT,
    status,
    headers,
    data
  };
};
const errorHandler = error => {
  // console.log('api-request reject: ', error.response);
  if (error.response) {
    const { status, statusText, data } = error.response;
    return {
      responseType: RESPONSE_TYPE.CONNECT_ERROR,
      status,
      message: data.message || statusText || 'Error! 404',
      errorType: data.errorType || 'unknown'
    };
  } else {
    return {
      responseType: RESPONSE_TYPE.NETWORK_ERROR,
      message: error.message || 'Network Error!'
    };
  }
};

// this encapsulation: to use async/await
export const apiRequest = ({ method, url, data = {}, config = {} }) => {
  switch (method) {
    case 'post':
    case 'put':
    case 'patch':
      return apiClient[method](url, data, config)
        .then(response => {
          return responseHandler(response);
        })
        .catch(error => {
          return errorHandler(error);
        });
    case 'get':
    case 'delete':
      return apiClient[method](url, { params: data })
        .then(response => {
          return responseHandler(response);
        })
        .catch(error => {
          return errorHandler(error);
        });
    default:
      console.log(`undefined method: ${method}`);
      return false;
  }
};
