import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFirstIndexes1686012254321 implements MigrationInterface {
    name = 'CreateFirstIndexes1686012254321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_b6c3eb6627eea437cddc571bdb" ON "exercise_muscle_impact" ("exerciseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a2cd89e9bfd7a0cd088cab466" ON "exercise" ("coachId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8a2cd89e9bfd7a0cd088cab466"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6c3eb6627eea437cddc571bdb"`);
    }

}
