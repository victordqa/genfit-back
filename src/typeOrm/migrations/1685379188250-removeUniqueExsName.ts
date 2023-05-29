import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueExsName1685379188250 implements MigrationInterface {
    name = 'RemoveUniqueExsName1685379188250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "muscle" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "time_per_rep_s" numeric(6,1) NOT NULL, "complexity" integer NOT NULL, "loadable" boolean NOT NULL, "is_cardio_specific" boolean NOT NULL, "coachId" integer, CONSTRAINT "UQ_ced51e8f6749afe0384175a4c7b" UNIQUE ("name"), CONSTRAINT "PK_cbce9889ea2f0fd84f740b5cbe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4"`);
        await queryRunner.query(`ALTER TABLE "muscle" ADD CONSTRAINT "FK_8763e86b7436bca579d32617ba6" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "muscle" DROP CONSTRAINT "FK_8763e86b7436bca579d32617ba6"`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "UQ_4420597915e901ab5d6f2bcaee4" UNIQUE ("name")`);
        await queryRunner.query(`DROP TABLE "muscle"`);
    }

}
