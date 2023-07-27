export class ResponseError extends Error {
  status: string;
  statusCode: number;

  constructor(status: string, message: string, statusCode: number) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;

    // This is to ensure instanceof properly works
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

export class MissingInformationError extends ResponseError {
  constructor(message: string = "Please fill the required fields") {
    super("missing-information", message, 422);

    Object.setPrototypeOf(this, MissingInformationError.prototype);
  }
}
