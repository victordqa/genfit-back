import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlockExerciseTable1688414786792 implements MigrationInterface {
    name = 'CreateBlockExerciseTable1688414786792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise_blocks_block" ("exerciseId" integer NOT NULL, "blockId" integer NOT NULL, CONSTRAINT "PK_b16267d03535a4ffdb833a5b442" PRIMARY KEY ("exerciseId", "blockId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3debe0523e99f38e75d97509a9" ON "exercise_blocks_block" ("exerciseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_95b89a40703743e211a21362d2" ON "exercise_blocks_block" ("blockId") `);
        await queryRunner.query(`ALTER TABLE "exercise_blocks_block" ADD CONSTRAINT "FK_3debe0523e99f38e75d97509a9f" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "exercise_blocks_block" ADD CONSTRAINT "FK_95b89a40703743e211a21362d25" FOREIGN KEY ("blockId") REFERENCES "block"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise_blocks_block" DROP CONSTRAINT "FK_95b89a40703743e211a21362d25"`);
        await queryRunner.query(`ALTER TABLE "exercise_blocks_block" DROP CONSTRAINT "FK_3debe0523e99f38e75d97509a9f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95b89a40703743e211a21362d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3debe0523e99f38e75d97509a9"`);
        await queryRunner.query(`DROP TABLE "exercise_blocks_block"`);
    }

}
