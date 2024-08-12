import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleResponse } from '@app/article/types/article-response.interface';
import slugify from 'slugify';
import { ArticlesResponse } from '@app/article/types/articles-response.interface';
import postgresDataSource from '@app/ormconfig';
import { FollowEntity } from '@app/profile/follow.entity';
import { UnifiedError } from '@app/shared/lib/unified-error';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    if (!article.slug) {
      article.slug = this.getSlug(createArticleDto.title);
    }

    article.favorited = false;
    article.author = currentUser;
    article.author.following = false;

    return await this.articleRepository.save(article);
  }

  async findBySlug(
    slug: string,
    currentUserId?: number,
  ): Promise<{ article: ArticleEntity; following: boolean }> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['comments'],
    });

    if (!article) {
      throw UnifiedError({
        title: 'Article',
        message: 'not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    article.favorited = false;

    if (!currentUserId) {
      return {
        article,
        following: false,
      };
    }

    const follows = await this.followRepository.find({
      where: { followerId: currentUserId, followingId: article.author.id },
    });

    let following = false;

    if (follows.length && currentUserId) {
      if (follows[0].followerId === currentUserId) {
        following = true;
      }
    }

    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    article.favorited = articleIndex > -1;

    return {
      article,
      following,
    };
  }

  buildArticleResponse(
    article: ArticleEntity & { following?: boolean },
    following?: boolean,
  ): ArticleResponse {
    if (following !== undefined) {
      article.author.following = following;
    }
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const { article } = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw UnifiedError({
        title: 'You are not an author',
        message: '',
        httpStatus: HttpStatus.FORBIDDEN,
      });
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    articleUpdateDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const { article } = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('No such article', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, articleUpdateDto);

    return await this.articleRepository.save(article);
  }

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponse> {
    const queryBuilder = postgresDataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author: UserEntity | null = await this.userRepository.findOne({
        where: { username: query.author },
      });

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author?.id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });

      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        // Bug требующий такой конструкции
        // М.б. уже пофиксили
        // Ошибка, если нет залайканный постов
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<{ article: ArticleEntity; following: boolean }> {
    const { article, following } = await this.findBySlug(slug, currentUserId);

    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    const isNotFavorited = articleIndex === -1;

    if (isNotFavorited) {
      // like
      user.favorites.push(article);
      article.favoritesCount++;
      article.favorited = true;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    } else {
      // dislike
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      article.favorited = false;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    }

    return { article, following };
  }

  async deleteArticleFromFavorites(slug: string, currentUserId: number) {
    const { article } = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    }

    return article;
  }

  async getFeed(currentUserId: number, query: any): Promise<ArticlesResponse> {
    const follows = await this.followRepository.find({
      where: { followerId: currentUserId },
    });

    if (!follows.length) {
      return {
        articles: [],
        articlesCount: 0,
      };
    }

    const followingUserIds = follows.map(
      (followingUser) => followingUser.followingId,
    );

    const queryBuilder = postgresDataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }
}
