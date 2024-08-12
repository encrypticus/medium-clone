import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponse } from '@app/article/types/article-response.interface';
import { ArticlesResponse } from '@app/article/types/articles-response.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponse> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponse> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async update(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article', new BackendValidationPipe())
    articleUpdateDto: CreateArticleDto,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      articleUpdateDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getBySlug(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<ArticleResponse> {
    const { article, following } = await this.articleService.findBySlug(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article, following);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async delete(@Param('slug') slug: string, @User('id') currentUserId: number) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    const { article, following } =
      await this.articleService.addArticleToFavorites(slug, currentUserId);
    return this.articleService.buildArticleResponse(article, following);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
