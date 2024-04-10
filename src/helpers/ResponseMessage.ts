export class ResponseMessage {
  constructor(
    public message: string,
    public statusCode = 200
  ) {}

  toJson(): Record<string, any> {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
