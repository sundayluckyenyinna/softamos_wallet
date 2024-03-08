/* eslint-disable */
import { v4 as uuidv4 } from 'uuid';

export default class AppHelper
{
  static generateUUID = (): string => {
      const uuid: string = uuidv4();
      return uuid;
  }

  static generateSequence = (count: number): string => {
    const min: number = 0;
    const max: number = 9;
    const randomIntegers = [];
    for (let i: number = 0; i < count; i++) {
      const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
      randomIntegers.push(randomNumber);
    }
    return randomIntegers.join('');
  }

  static getRandomIntegerBetween(minimum: number, maximum: number): number{
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  static cleanToken(token: string): string{
     return token ? token.replace("Bearer ", "").trim() : "";
  }
}