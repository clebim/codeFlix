import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategorySchema } from './category';

@Entity('video')
export class VideoSchema {
  @PrimaryColumn({ unique: true, type: 'uuid' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  filename: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ default: true })
  public: boolean;

  @Column({ default: 0 })
  likes: number;

  @ManyToMany(() => CategorySchema, category => category.videos)
  @JoinTable({
    name: 'video_category',
    joinColumns: [{ name: 'video_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id' }],
  })
  categories: CategorySchema[];

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', select: false })
  updatedAt: Date;
}
