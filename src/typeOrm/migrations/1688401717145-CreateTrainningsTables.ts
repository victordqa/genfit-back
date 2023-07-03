import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrainningsTables1688401717145 implements MigrationInterface {
    name = 'CreateTrainningsTables1688401717145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trainning_block" ("id" SERIAL NOT NULL, "duration_in_m" integer NOT NULL, "trainningId" integer, CONSTRAINT "PK_aa0bb3fe47230ad2c5808c63041" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trainning" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "boxId" integer, CONSTRAINT "PK_1df224fe5716f96419aa99632b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "box" DROP CONSTRAINT "FK_3aa6eb102e6932f386e49feafce"`);
        await queryRunner.query(`ALTER TABLE "box" ALTER COLUMN "coachId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_ebba0728def8d978242e46d0d12" FOREIGN KEY ("trainningId") REFERENCES "trainning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trainning" ADD CONSTRAINT "FK_367d0ec32705a148c813f3db765" FOREIGN KEY ("boxId") REFERENCES "box"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "box" ADD CONSTRAINT "FK_3aa6eb102e6932f386e49feafce" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "box" DROP CONSTRAINT "FK_3aa6eb102e6932f386e49feafce"`);
        await queryRunner.query(`ALTER TABLE "trainning" DROP CONSTRAINT "FK_367d0ec32705a148c813f3db765"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_ebba0728def8d978242e46d0d12"`);
        await queryRunner.query(`ALTER TABLE "box" ALTER COLUMN "coachId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "box" ADD CONSTRAINT "FK_3aa6eb102e6932f386e49feafce" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "trainning"`);
        await queryRunner.query(`DROP TABLE "trainning_block"`);
    }

}
