import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  link: string;

  @Column('jsonb', { nullable: true })
  additionalData: Record<string, any>;
}
