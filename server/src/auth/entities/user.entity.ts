import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  nonce: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  username: string;
  id: any;
}
