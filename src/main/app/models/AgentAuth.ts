/*eslint-disable*/

import { Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from "typeorm";
import Agent from "./Agent";

@Entity({ name: "st_agent_auth" })
export default class AgentAuth{

  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: number;

  @OneToOne((type) => Agent, { eager: true, cascade: true })
  @JoinColumn({ name: "agent_id" })
  agent: Agent;

  @Column({ name: "auth_token", type: "text", nullable: false })
  authToken: string;

  @Column({ name: "created_at", type: "timestamp", nullable: false })
  createdAt: Date;

  @Column({ name: "updated_at", type: "timestamp", nullable: false })
  updatedAt: Date;
}