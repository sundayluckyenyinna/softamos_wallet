/* eslint-disable */
import * as jwt from 'jsonwebtoken';
import Environment from "../config/Environment";
import ApiException from "../exceptions/ApiException";
import { JwtPayload } from "jsonwebtoken";

export default class JwtTokenUtil {

  static secretKey: string = Environment.getProperty("app.authorization.token.secret")
  static expirationTime: string = Environment.getProperty("app.authorization.token.expiresIn");

  static generateToken = (tokenRequestData: GenerateTokenRequestData): string => {
    const requestDataJson: Object = JSON.parse(JSON.stringify(tokenRequestData));
    return jwt.sign(requestDataJson, JwtTokenUtil.secretKey, { expiresIn: JwtTokenUtil.expirationTime });
  }

  static decodeToken = (token: string): JwtPayload | string => {
    let decoded: JwtPayload | string = undefined;
    try{
      decoded = jwt.verify(token, JwtTokenUtil.secretKey);
    }catch (error){
      ApiException.throwNewBadRequestInstance("Expired token error: ".concat(error.message));
    }
    return decoded;
  }

  static getUsernameFromToken = (token: string): string => {
    return (this.decodeToken(token) as GenerateTokenRequestData).username;
  }

  static getEmailFromToken = (token: string): string => {
    return (this.decodeToken(token) as GenerateTokenRequestData).emailAddress;
  }

  static getMobileNumberFromToken = (token: string): string => {
    return (this.decodeToken(token) as GenerateTokenRequestData).mobileNumber;
  }
}


export interface GenerateTokenRequestData{
  username: string;
  emailAddress: string,
  mobileNumber: string;
}
