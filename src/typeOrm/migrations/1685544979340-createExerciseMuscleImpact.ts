import { MigrationInterface, QueryRunner } from 'typeorm';
import { musclesRefs } from '../seeds/muscles';
import { Muscle } from '../entities/Muscle';

export class CreateExerciseMuscleImpact1685544979340
  implements MigrationInterface
{
  name = 'CreateExerciseMuscleImpact1685544979340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "muscle" DROP CONSTRAINT "FK_8763e86b7436bca579d32617ba6"`,
    );
    await queryRunner.query(
      `CREATE TABLE "exercise_muscle_impact" ("id" SERIAL NOT NULL, "exerciseId" integer NOT NULL, "muscleId" integer NOT NULL, "impact" integer NOT NULL, CONSTRAINT "PK_3c8fb1cacab57d2c403a5958863" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "muscle" DROP COLUMN "time_per_rep_s"`,
    );
    await queryRunner.query(`ALTER TABLE "muscle" DROP COLUMN "complexity"`);
    await queryRunner.query(`ALTER TABLE "muscle" DROP COLUMN "loadable"`);
    await queryRunner.query(
      `ALTER TABLE "muscle" DROP COLUMN "is_cardio_specific"`,
    );
    await queryRunner.query(`ALTER TABLE "muscle" DROP COLUMN "coachId"`);
    await queryRunner.query(
      `ALTER TABLE "muscle" ADD "ref_week_load" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle_impact" ADD CONSTRAINT "FK_b6c3eb6627eea437cddc571bdb5" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle_impact" ADD CONSTRAINT "FK_e7c43d6fb64615973f88b3b5320" FOREIGN KEY ("muscleId") REFERENCES "muscle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const muscleInstances = musclesRefs.map((muscle) => {
      return queryRunner.manager.create<Muscle>(Muscle, {
        name: muscle.name,
        ref_week_load: muscle.loadRefPerTrainning,
      });
    });
    await queryRunner.manager.save(muscleInstances);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle_impact" DROP CONSTRAINT "FK_e7c43d6fb64615973f88b3b5320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle_impact" DROP CONSTRAINT "FK_b6c3eb6627eea437cddc571bdb5"`,
    );
    await queryRunner.query(`ALTER TABLE "muscle" DROP COLUMN "ref_week_load"`);
    await queryRunner.query(`ALTER TABLE "muscle" ADD "coachId" integer`);
    // await queryRunner.query(
    //   `ALTER TABLE "muscle" ADD "is_cardio_specific" boolean NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "muscle" ADD "loadable" boolean NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "muscle" ADD "complexity" integer NOT NULL`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "muscle" ADD "time_per_rep_s" numeric(6,1) NOT NULL`,
    // );
    await queryRunner.query(`DROP TABLE "exercise_muscle_impact"`);
    await queryRunner.query(
      `ALTER TABLE "muscle" ADD CONSTRAINT "FK_8763e86b7436bca579d32617ba6" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
