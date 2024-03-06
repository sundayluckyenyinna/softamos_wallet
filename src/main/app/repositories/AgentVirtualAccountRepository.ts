/*eslint-disable*/

import { DataSource, Repository } from "typeorm";
import AgentVirtualAccount from "../models/AgentVirtualAccount";
import { Injectable } from "@nestjs/common";


@Injectable()
export default class AgentVirtualAccountRepository extends Repository<AgentVirtualAccount>{

   constructor(private readonly dataSource: DataSource) {
     super(AgentVirtualAccount, dataSource.createEntityManager());
   }
}