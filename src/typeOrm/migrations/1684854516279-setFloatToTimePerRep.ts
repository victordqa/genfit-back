import { MigrationInterface, QueryRunner } from "typeorm";

export class SetFloatToTimePerRep1684854516279 implements MigrationInterface {
    name = 'SetFloatToTimePerRep1684854516279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD "complexity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "time_per_rep_s"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "time_per_rep_s" numeric(6,1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "time_per_rep_s"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD "time_per_rep_s" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "complexity"`);
    }

}
