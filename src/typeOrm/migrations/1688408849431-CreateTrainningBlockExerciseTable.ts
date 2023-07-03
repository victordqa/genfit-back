import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrainningBlockExerciseTable1688408849431 implements MigrationInterface {
    name = 'CreateTrainningBlockExerciseTable1688408849431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trainning_block_exercise" ("id" SERIAL NOT NULL, "exerciseId" integer NOT NULL, "trainningBlockId" integer NOT NULL, "reps" integer NOT NULL, "load" double precision NOT NULL, CONSTRAINT "PK_9473620786157a823e6e0c65dc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e96c5b97604d00bc45c42b0f4c" ON "trainning_block_exercise" ("exerciseId") `);
        await queryRunner.query(`ALTER TABLE "trainning_block_exercise" ADD CONSTRAINT "FK_e96c5b97604d00bc45c42b0f4cc" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trainning_block_exercise" ADD CONSTRAINT "FK_ee460ec598cb7fc319f8fb4b0e4" FOREIGN KEY ("trainningBlockId") REFERENCES "trainning_block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainning_block_exercise" DROP CONSTRAINT "FK_ee460ec598cb7fc319f8fb4b0e4"`);
        await queryRunner.query(`ALTER TABLE "trainning_block_exercise" DROP CONSTRAINT "FK_e96c5b97604d00bc45c42b0f4cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e96c5b97604d00bc45c42b0f4c"`);
        await queryRunner.query(`DROP TABLE "trainning_block_exercise"`);
    }

}
