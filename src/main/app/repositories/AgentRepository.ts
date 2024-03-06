/* eslint-disable*/

import { Injectable } from "@nestjs/common";
import Agent from "../models/Agent";
import { DataSource, Repository } from "typeorm";

@Injectable()
export default class AgentRepository extends Repository<Agent>{

  constructor(private readonly datasource: DataSource) {
    super(Agent, datasource.createEntityManager());
  }

}