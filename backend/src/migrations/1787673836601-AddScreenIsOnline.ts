import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScreenIsOnline1787673836601 implements MigrationInterface {
  name = 'AddScreenIsOnline1787673836601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`screens\`
      ADD \`isOnline\` tinyint NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`screens\`
      DROP COLUMN \`isOnline\`
    `);
  }
}
