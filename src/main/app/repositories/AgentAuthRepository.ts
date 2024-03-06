/*eslint-disable*/


import { DataSource, Repository } from "typeorm";
import AgentAuth from "../models/AgentAuth";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class AgentAuthRepository extends Repository<AgentAuth>{

   constructor(private readonly datasource: DataSource) {
     super(AgentAuth, datasource.createEntityManager());
   }
}