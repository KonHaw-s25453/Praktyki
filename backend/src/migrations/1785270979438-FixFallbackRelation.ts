import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFallbackRelation1785270979438 implements MigrationInterface {
    name = 'FixFallbackRelation1785270979438'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        ALTER TABLE \`screens\`
        DROP COLUMN \`fallbackFileId\`
    `);
}

    public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`
        ALTER TABLE \`screens\`
        ADD COLUMN \`fallbackFileId\` int NULL
    `);

}
}
