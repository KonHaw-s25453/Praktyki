import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerUrlToScreens1786376250038
    implements MigrationInterface
{
    name = "AddPlayerUrlToScreens1786376250038";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`screens\` ADD \`playerUrl\` varchar(500) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`screens\` DROP COLUMN \`playerUrl\``
        );
    }
}