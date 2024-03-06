/*eslint-disable*/

import AppHelper from "../utils/AppHelper";

export const BANKS: Array<BankData> = [
  { bankName: "ZENITH BANK", bankCode: "057" },
  { bankName: "OPAY", bankCode: "0941"}, { bankName: "GUARANTEE TRUST BANK", bankCode: "068" }, {bankName: "UBA", bankCode: "096"},
  {bankName: "PALMPAY", bankCode: "09843"}, {bankName: "ACCESS BANK", bankCode: "042"}
]

export interface BankData{
   bankName: string;
   bankCode: string;
}

export class MockBankRepository{

   public static getRandomBank(): BankData {
       const banksSize : number = BANKS.length;
       const randomIndex: number = AppHelper.getRandomIntegerBetween(0, banksSize - 1);
       return BANKS[randomIndex];
   }
}