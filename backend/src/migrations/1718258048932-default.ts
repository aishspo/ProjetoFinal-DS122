import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1718258048932 implements MigrationInterface {
    name = 'Default1718258048932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`documents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`filePath\` varchar(255) NULL, \`folderId\` int NULL, \`studentId\` int NULL, UNIQUE INDEX \`IDX_ac51aa5181ee2036f5ca482857\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`folders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`filePath\` varchar(255) NOT NULL DEFAULT '', \`studentId\` int NULL, UNIQUE INDEX \`IDX_8578bd31b0e7f6d6c2480dbbca\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_7d7f07271ad4ce999880713f05\` (\`id\`), UNIQUE INDEX \`REL_e0208b4f964e609959aff431bf\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_a8d4f83be3abe4c687b0a0093c\` (\`id\`), UNIQUE INDEX \`REL_4d8041cbc103a5142fa2f2afad\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`documents\` ADD CONSTRAINT \`FK_cf0a9fa48053d1f93da40713cc1\` FOREIGN KEY (\`folderId\`) REFERENCES \`folders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`documents\` ADD CONSTRAINT \`FK_c4e6583ef1c84c8999ef780296c\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`folders\` ADD CONSTRAINT \`FK_87b6abe77c833048fea9ab578b8\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_e0208b4f964e609959aff431bf9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teachers\` ADD CONSTRAINT \`FK_4d8041cbc103a5142fa2f2afad4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_4d8041cbc103a5142fa2f2afad4\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_e0208b4f964e609959aff431bf9\``);
        await queryRunner.query(`ALTER TABLE \`folders\` DROP FOREIGN KEY \`FK_87b6abe77c833048fea9ab578b8\``);
        await queryRunner.query(`ALTER TABLE \`documents\` DROP FOREIGN KEY \`FK_c4e6583ef1c84c8999ef780296c\``);
        await queryRunner.query(`ALTER TABLE \`documents\` DROP FOREIGN KEY \`FK_cf0a9fa48053d1f93da40713cc1\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_4d8041cbc103a5142fa2f2afad\` ON \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_a8d4f83be3abe4c687b0a0093c\` ON \`teachers\``);
        await queryRunner.query(`DROP TABLE \`teachers\``);
        await queryRunner.query(`DROP INDEX \`REL_e0208b4f964e609959aff431bf\` ON \`students\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d7f07271ad4ce999880713f05\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
        await queryRunner.query(`DROP INDEX \`IDX_8578bd31b0e7f6d6c2480dbbca\` ON \`folders\``);
        await queryRunner.query(`DROP TABLE \`folders\``);
        await queryRunner.query(`DROP INDEX \`IDX_ac51aa5181ee2036f5ca482857\` ON \`documents\``);
        await queryRunner.query(`DROP TABLE \`documents\``);
    }

}
