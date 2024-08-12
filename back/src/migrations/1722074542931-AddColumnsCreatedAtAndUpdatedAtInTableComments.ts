import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsCreatedAtAndUpdatedAtInTableComments1722074542931
  implements MigrationInterface
{
  name = 'AddColumnsCreatedAtAndUpdatedAtInTableComments1722074542931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
  }
}
