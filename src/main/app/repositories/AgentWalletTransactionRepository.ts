/*eslint-disable*/

import { DataSource, Repository } from "typeorm";
import AgentWalletTransaction from "../models/AgentWalletTransaction";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class AgentWalletTransactionRepository extends Repository<AgentWalletTransaction>{

  constructor(private readonly dataSource: DataSource) {
     super(AgentWalletTransaction, dataSource.createEntityManager());
  }

}