import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1719647907493 implements MigrationInterface {
  name = 'SeedDb1719647907493';

  // add tags
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    // add user
    // password: user
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('user', 'user@email.com', '$2b$10$4I1GewCaUe078jlxshoolusSZ4mhSdPw42VtnrrL1K9.mAe/B3ODW')`,
    );

    // add article
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'first article description', 'first article body', 'coffee,dragons', 1)`,
    );

    // add article
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second article', 'second article description', 'second article body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
