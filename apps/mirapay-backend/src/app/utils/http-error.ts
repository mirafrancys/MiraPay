export class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    
    // Assurer que le prototype est correctement défini
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
