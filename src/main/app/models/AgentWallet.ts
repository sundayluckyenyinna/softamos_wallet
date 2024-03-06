/*eslint-disable*/

import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Agent from "./Agent";


@Entity({ name: "st_agent_wallet" })
export default class AgentWallet {

  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: number;

   @Column({ name: "wallet_id", type: "varchar", nullable: false })
   walletId: string;

   @Column({ name: "slug", type: "varchar", nullable: false })
   slug: string;

   @Column({ name: "balance", type: "decimal", nullable: false })
   balance: number;

   @Column({ name: "status", type: "varchar", nullable: false })
   status: string;

  @Column({ name: "currency", type: "varchar", nullable: false })
  currency: string;

   @OneToOne((type) => Agent, { eager: true, cascade: true })
   @JoinColumn({ name: "agent_id"})
   agent: Agent;

   @Column({ name: "created_at", type: "timestamp", nullable: false })
   createdAt: Date;

   @Column({ name: "updated_at", type: "timestamp", nullable: false })
   updatedAt: Date;

}