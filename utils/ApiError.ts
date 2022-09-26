export class ApiError extends Error {
  status: number;
  code: number;

  constructor(status: number, message: string, code: number) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
