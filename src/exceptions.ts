export class DvNetException extends Error {
  constructor(message: string, public code?: number, public previous?: Error) {
    super(message);
    this.name = 'DvNetException';
  }
}
export class DvNetInvalidResponseDataException extends DvNetException {
  constructor(message: string, previous?: Error) {
    super(message, undefined, previous);
    this.name = 'DvNetInvalidResponseDataException';
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
