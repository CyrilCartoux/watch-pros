export interface ErrorWithMessage extends Error {
  message: string;
  stack?: string;
}

export function logError(error: ErrorWithMessage, context: string) {
  console.error(`
🚨 API Error in ${context}:
  Error: ${error.message}
  Stack: ${error.stack}
  Timestamp: ${new Date().toISOString()}
`);
}

export function logApiError(error: ErrorWithMessage, context: string, request?: Request) {
  const requestInfo = request ? {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  } : {};

  console.error(`
🚨 API Error in ${context}:
  Error: ${error.message}
  Stack: ${error.stack}
  Request: ${JSON.stringify(requestInfo, null, 2)}
  Timestamp: ${new Date().toISOString()}
`);
}

export function logApiSuccess<T>(data: T, context: string) {
  console.log(`
✅ API Success in ${context}:
  Data: ${JSON.stringify(data, null, 2)}
  Timestamp: ${new Date().toISOString()}
`);
} 