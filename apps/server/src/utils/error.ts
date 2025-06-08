export class NotFoundError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404; // HTTP status code for Not Found
  }
}

export class UnauthorizedError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401; // HTTP status code for Unauthorized
  }
}

export class ForbiddenError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403; // HTTP status code for Forbidden
  }
}

export class InternalServerError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500; // HTTP status code for Internal Server Error
  }
}

export class BadRequestError extends Error {
  public details?: string[] | string | Record<string | number, string | number>;
  public form?: string[] | string | Record<string | number, string | number>;
  public status: number;

  constructor(
    message: string,
    details?: string[] | string | Record<string | number, string | number>,
    form?: string[] | string | Record<string | number, string | number>
  ) {
    super(message);

    this.name = 'BadRequestError';
    this.details = details; // Details information will be used for toastify errors notifications
    this.form = form;
    this.status = 400; // HTTP status code for Bad Request
  }
}

export class ServiceUnavailableError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.status = 503; // HTTP status code for Service Unavailable
  }
}

export class RateLimitExceededError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'RateLimitExceededError';
    this.status = 429; // HTTP status code for Too Many Requests
  }
}

export class NotImplementedError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
    this.status = 501; // HTTP status code for Not Implemented
  }
}

export class DependencyError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'DependencyError';
    this.status = 424; // HTTP status code for Failed Dependency
  }
}

export class TimeoutError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
    this.status = 408; // HTTP status code for Request Timeout
  }
}
