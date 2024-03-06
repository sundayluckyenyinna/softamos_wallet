/*eslint-disable*/

import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Agent from "./Agent";

export default class AgentVirtualAccount{

    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    id: number;

    @OneToOne((type) => Agent, { eager: true, cascade: true })
    @JoinColumn({ name: "agent_id "})
    agent: Agent;

    @Column({ name: "account_number", type: "varchar", nullable: false })
    accountNumber: string;

    @Column({ name: "account_name", type: "varchar", nullable: false })
    accountName: string;

    @Column({ name: "account_number", type: "varchar", nullable: false })
    bankCode: string;

    @Column({ name: "account_number", type: "varchar", nullable: false })
    bankName: string;

    @Column({ name: "created_at", type: "timestamp", nullable: false })
    createdAt: Date;

    @Column({ name: "updated_at", type: "timestamp", nullable: false })
    updatedAt: Date;
}