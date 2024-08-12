import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNameToUsers1719650985394 implements MigrationInterface {
  name = 'AddUserNameToUsers1719650985394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
