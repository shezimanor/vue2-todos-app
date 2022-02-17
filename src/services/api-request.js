// API response type constant
export const RESPONSE_TYPE = {
  CONNECT_CORRECT: 'CONNECT_CORRECT',
  CONNECT_ERROR: 'CONNECT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

// Error Response: localStorage access denied response
const localStorageAccessDeniedResponse = {
  response: {
    status: 404,
    statusText: 'localStorage access is denied!',
    data: { errorType: 'accessDenied' }
  }
};

// Correct Response Handler
export const responseHandler = response => {
  // console.log('api-request resolve: ', response);
  const { headers, status, data } = response;
  return {
    responseType: RESPONSE_TYPE.CONNECT_CORRECT,
    status,
    headers,
    data
  };
};

// Error Response Handler
export const errorHandler = error => {
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

// (todo)create a Promise to manipulate localStorage
export const apiRequest = requestManipulation =>
  new Promise((resolve, reject) => {
    if (!('localStorage' in window)) reject(localStorageAccessDeniedResponse);
    requestManipulation(resolve, reject);
  })
    .then(response => {
      console.log(`responseHandler`, response);
      return responseHandler(response);
    })
    .catch(error => {
      return errorHandler(error);
    });
