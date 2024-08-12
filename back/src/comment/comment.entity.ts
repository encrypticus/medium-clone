import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from '../article/article.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, {
    eager: true,
  })
  article: ArticleEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
