/*eslint-disable*/

export default class ApiException{

  constructor(public code: number, public message: string) {
  }

  public static newInstance(code: number, message: string): ApiException{
     return new ApiException(code, message);
  }

  public static throwNewInstance(code: number, message: string): void {
    throw new ApiException(code, message);
  }

  public static throwNewBadRequestInstance(message: string): void {
     throw new ApiException(400, message);
  }
}