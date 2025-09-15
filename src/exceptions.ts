export class DvNetException extends Error {
  constructor(message: string, public code?: number, public previous?: Error) {
    super(message);
    this.name = 'DvNetException';
  }
}
export class DvNetInvalidRequestException extends DvNetException {
  constructor(message: string, previous?: Error) {
    super(message, undefined, previous);
    this.name = 'DvNetInvalidRequestException';
  }
}
export class DvNetInvalidResponseDataException extends DvNetException {
  constructor(message: string, previous?: Error) {
    super(message, undefined, previous);
    this.name = 'DvNetInvalidResponseDataException';
  }
}
export class DvNetNetworkException extends DvNetException {
  constructor(message: string, public request?: any, code?: number, previous?: Error) {
    super(message, code, previous);
    this.name = 'DvNetNetworkException';
  }
}
export class DvNetRequestExceptions extends DvNetException {
  constructor(message: string, public request?: any, code?: number, previous?: Error) {
    super(message, code, previous);
    this.name = 'DvNetRequestExceptions';
  }
}
export class DvNetServerException extends DvNetException {
  constructor(message: string, public request?: any, code?: number, previous?: Error) {
    super(message, code, previous);
    this.name = 'DvNetServerException';
  }
}
export class DvNetUndefinedHostException extends DvNetException {
  constructor(message: string) {
    super(message);
    this.name = 'DvNetUndefinedHostException';
  }
}
export class DvNetUndefinedXApiKeyException extends DvNetException {
  constructor(message: string) {
    super(message);
    this.name = 'DvNetUndefinedXApiKeyException';
  }
}
