/*eslint-disable*/

import { PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Entity } from "typeorm";
import Agent from "./Agent";


@Entity({ name: "st_wallet_agent_transaction"})
export default class AgentWalletTransaction{

   @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
   id: number;

   @ManyToOne((type) => Agent, { eager: true, cascade: true })
   @JoinColumn({ name: "agent_id" })
   agent: Agent;

   @Column({ name: "beneficial_agent_wallet_id", type: "varchar", nullable: true })
   beneficialAgentWalletId: string;

   @Column({ name: "beneficiary_name", nullable: false })
   beneficiaryName: string;

   @Column({ name: "beneficiary_email" })
   beneficiaryEmail: string;

   @Column({ name: "request_id", type: "varchar", nullable: false})
   requestId: string;

   @Column({ name: "transaction_id", type: "varchar", nullable: false })
   transactionId: string;

   @Column({ name: "amount", type: "decimal", nullable: false })
   amount: number;

   @Column({ name: "wallet_balance", type: "varchar", nullable: false })
   walletBalance: number;

   @Column({ name: "payment_gateway", type: "varchar", nullable: false })
   paymentGateway: string;

   @Column({ name: "transaction_type", type: "varchar", nullable: false })
   transactionType: string;

   @Column({ name: "dr_cr", type: "varchar", nullable: false })
   drCr: string;

   @Column({ name: "status", type: "varchar", nullable: false })
   status: string;

   narration: string;

   @Column({ name: "created_at", type: "timestamp", nullable: false })
   createdAt: Date;

    @Column({ name: "updated_at", type: "timestamp", nullable: false })
    updatedAt: Date;
}