import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('category')
export class CategorySchema {
  @PrimaryColumn({ unique: true, type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', select: false })
  updatedAt: Date;
}
