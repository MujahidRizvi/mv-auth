import { Response } from 'express';

export interface IOverrideRequest {
  code: number;
  message: string;
  positive: string;
  negative: string;
}
export default class ApiResponse {
  static result = (res: Response, data: object, status: number) => {
    res.status(status);
    res.json({
      data,
      success: true,
    });
  };

  // static error = (
  //   res: Response,
  //   status: number = 400,
  //   error: string = httpStatusCodes.getStatusText(status),
  //   override: IOverrideRequest = null,
  // ) => {
  //   res.status(status).json({
  //     override,
  //     error: {
  //       message: error,
  //     },
  //     success: false,
  //   });
  // };
}
