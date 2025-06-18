import { z } from 'zod';

export enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_LOCKED_OUT = 'USER_LOCKED_OUT',
  ZOD_ERROR = 'ZOD_ERROR',
  INSUFFICIENT_STORAGE = 'INSUFFICIENT_STORAGE'
}


const httpErrorSchema = z.object({
  code: z.nativeEnum(ErrorCodes),
  message: z.string()
});

export const errors = [
  // Client errors (4xx)
  { status: 400, schema: httpErrorSchema }, // Bad Request
  { status: 401, schema: httpErrorSchema }, // Unauthorized
  { status: 402, schema: httpErrorSchema }, // Payment Required
  { status: 403, schema: httpErrorSchema }, // Forbidden
  { status: 404, schema: httpErrorSchema }, // Not Found
  { status: 405, schema: httpErrorSchema }, // Method Not Allowed
  { status: 406, schema: httpErrorSchema }, // Not Acceptable
  { status: 407, schema: httpErrorSchema }, // Proxy Authentication Required
  { status: 408, schema: httpErrorSchema }, // Request Timeout
  { status: 409, schema: httpErrorSchema }, // Conflict
  { status: 410, schema: httpErrorSchema }, // Gone
  { status: 411, schema: httpErrorSchema }, // Length Required
  { status: 412, schema: httpErrorSchema }, // Precondition Failed
  { status: 413, schema: httpErrorSchema }, // Payload Too Large
  { status: 414, schema: httpErrorSchema }, // URI Too Long
  { status: 415, schema: httpErrorSchema }, // Unsupported Media Type
  { status: 416, schema: httpErrorSchema }, // Range Not Satisfiable
  { status: 417, schema: httpErrorSchema }, // Expectation Failed
  { status: 418, schema: httpErrorSchema }, // I'm a Teapot
  { status: 421, schema: httpErrorSchema }, // Misdirected Request
  { status: 422, schema: httpErrorSchema }, // Unprocessable Entity
  { status: 423, schema: httpErrorSchema }, // Locked
  { status: 424, schema: httpErrorSchema }, // Failed Dependency
  { status: 425, schema: httpErrorSchema }, // Too Early
  { status: 426, schema: httpErrorSchema }, // Upgrade Required
  { status: 428, schema: httpErrorSchema }, // Precondition Required
  { status: 429, schema: httpErrorSchema }, // Too Many Requests
  { status: 431, schema: httpErrorSchema }, // Request Header Fields Too Large
  { status: 451, schema: httpErrorSchema }, // Unavailable For Legal Reasons

  // Server errors (5xx)
  { status: 500, schema: httpErrorSchema }, // Internal Server Error
  { status: 501, schema: httpErrorSchema }, // Not Implemented
  { status: 502, schema: httpErrorSchema }, // Bad Gateway
  { status: 503, schema: httpErrorSchema }, // Service Unavailable
  { status: 504, schema: httpErrorSchema }, // Gateway Timeout
  { status: 505, schema: httpErrorSchema }, // HTTP Version Not Supported
  { status: 506, schema: httpErrorSchema }, // Variant Also Negotiates
  { status: 507, schema: httpErrorSchema }, // Insufficient Storage
  { status: 508, schema: httpErrorSchema }, // Loop Detected
  { status: 510, schema: httpErrorSchema }, // Not Extended
  { status: 511, schema: httpErrorSchema } // Network Authentication Required
];