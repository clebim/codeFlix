import {
  Column,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { VideoSchema } from './video';

@Entity('category')
export class CategorySchema {
  @PrimaryColumn({ unique: true, type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', select: false })
  updatedAt: Date;

  @ManyToMany(() => VideoSchema, video => video.categories)
  videos: VideoSchema[];
}
