import { errors } from './errors';

export const success = (body: any = {}, status = 200, extraHeaders = {}) => {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
    body:
      extraHeaders?.['content-type'] === 'text/html'
        ? body
        : JSON.stringify(body || {}),
  };
};

export const error = (type, datails, context) => {
  return {
    statusCode: errors[type].status || errors.UnexpectedException.status,
    body: JSON.stringify({
      message: errors[type].defaultMessage || errors.UnexpectedException.status,
      datails: datails || {},
      functionName: (context && context.functionName) || '',
    }),
  };
};
