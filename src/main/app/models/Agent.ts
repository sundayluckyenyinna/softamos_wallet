/*eslint-disable*/

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';


@Entity({ name: "st_agent" })
export default class Agent {

  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: number;

  @Column({ name: "agent_uid", type: "varchar", unique: true, nullable: false })
  agentId: string;

  @Column({ name: "slug", type: "varchar", unique: true, nullable: false })
  slug: string;

  @Column({ name: "username", type: "varchar", nullable: false })
  username: string;

  @Column({ name: "mobile_number", type: "varchar", unique: true, nullable: false })
  mobileNumber: string;

  @Column({ name: "email_address", type: "varchar", nullable: false })
  emailAddress: string;

  @Column({ name: "status", type: "varchar", nullable: false })
  status: string;

  @Column({ name: 'state', type: "varchar", nullable: false })
  state: string;

  @Column({ name: "city", type: "varchar", nullable: false })
  city: string;

  @Column({ name: "location_address", type: "varchar", nullable: false })
  locationAddress: string;

  @Column({ name: "password", type: "varchar", nullable: false })
  password: string;

  @Column( { name: "created_at", type: "timestamp", nullable: false } )
  createdAt: Date;

  @Column({ name: "updated_at", type: "timestamp", nullable: false })
  updatedAt: Date;
}