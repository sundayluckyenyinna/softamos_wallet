/*eslint-disable*/

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import AgentWallet from "../models/AgentWallet";

@Injectable()
export default class AgentWalletRepository extends Repository<AgentWallet>{

   constructor(private readonly dataSource: DataSource) {
     super(AgentWallet, dataSource.createEntityManager());
   }
}