import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlaylistPlaybackOptions1785947970008 implements MigrationInterface {
    name = 'AddPlaylistPlaybackOptions1785947970008'

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`playlist_items\`
        ADD \`videoLoops\` int NOT NULL DEFAULT '1'
    `);

    await queryRunner.query(`
        ALTER TABLE \`playlists\`
        ADD \`repeatMode\` varchar(20) NOT NULL DEFAULT 'LOOP'
    `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`playlists\`
        DROP COLUMN \`repeatMode\`
    `);

    await queryRunner.query(`
        ALTER TABLE \`playlist_items\`
        DROP COLUMN \`videoLoops\`
    `);
}

}
