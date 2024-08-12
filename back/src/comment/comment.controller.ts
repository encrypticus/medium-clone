import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from '@app/comment/comment.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateCommentDto } from '@app/comment/dto/create-comment.dto';
import { CommentResponse } from '@app/comment/types/comment-response.interface';
import { CommentsResponse } from '@app/comment/types/comments-response.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { UpdateCommentDto } from '@app/comment/dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(): Promise<CommentsResponse> {
    return await this.commentService.findAll();
  }

  @Post()
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @User('id') currentUserId: number,
    @Body('comment') crateCommentDto: CreateCommentDto,
  ): Promise<CommentResponse> {
    const comment = await this.commentService.createComment(
      currentUserId,
      crateCommentDto,
    );
    return this.commentService.buildCommentResponse(comment);
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(
    @User('id') currentUserId: number,
    @Body('comment', new BackendValidationPipe())
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponse> {
    const comment = await this.commentService.updateComment(
      currentUserId,
      updateCommentDto,
    );

    return this.commentService.buildCommentResponse(comment);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('id') commentId: number,
    @User('id') currentUserId: number,
  ) {
    return await this.commentService.deleteComment(commentId, currentUserId);
  }
}
