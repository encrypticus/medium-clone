import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@app/comment/dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CommentEntity } from '@app/comment/comment.entity';
import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from '@app/article/article.entity';
import { CommentResponse } from '@app/comment/types/comment-response.interface';
import postgresDataSource from '@app/ormconfig';
import { CommentsResponse } from '@app/comment/types/comments-response.interface';
import { UnifiedError } from '@app/shared/lib/unified-error';
import { UpdateCommentDto } from '@app/comment/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async findAll(): Promise<CommentsResponse> {
    const qb = postgresDataSource
      .getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('comments.article', 'article');

    const comments = await qb.getMany();
    const commentsCount = await qb.getCount();

    return {
      comments,
      commentsCount,
    };
  }

  async createComment(
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const article = await this.articleRepository.findOne({
      where: { id: createCommentDto.articleId },
    });

    if (!article) {
      throw UnifiedError({
        title: 'Article',
        message: 'not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    const comment = new CommentEntity();
    comment.text = createCommentDto.text;
    comment.user = user;
    comment.article = article;

    return await this.commentRepository.save(comment);
  }

  async updateComment(
    currentUserId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: updateCommentDto.id,
      },
      relations: ['user'],
    });

    if (!comment) {
      throw UnifiedError({
        title: 'Comment',
        message: 'Comment not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (currentUserId !== comment.user.id) {
      throw UnifiedError({
        title: 'Comment',
        message: 'You are not the author of this comment',
        httpStatus: HttpStatus.FORBIDDEN,
      });
    }

    Object.assign(comment, {
      ...comment,
      text: updateCommentDto.text,
    });

    return await this.commentRepository.save(comment);
  }

  async deleteComment(
    commentId: number,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw UnifiedError({
        title: 'Comment',
        message: 'Comment not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (currentUserId !== comment.user.id) {
      throw UnifiedError({
        title: 'Comment',
        message: 'You are not the author of this comment',
        httpStatus: HttpStatus.FORBIDDEN,
      });
    }

    return this.commentRepository.delete({ id: commentId });
  }

  buildCommentResponse(comment: CommentEntity): CommentResponse {
    return {
      comment,
    };
  }
}
