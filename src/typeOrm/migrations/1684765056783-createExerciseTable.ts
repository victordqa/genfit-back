import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExerciseTable1684765056783 implements MigrationInterface {
    name = 'CreateExerciseTable1684765056783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "time_per_rep_s" integer NOT NULL, "loadable" boolean NOT NULL, "is_cardio_specific" boolean NOT NULL, "coachId" integer, CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4" UNIQUE ("name"), CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
    }

}
