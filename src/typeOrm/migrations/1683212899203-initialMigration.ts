import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683212899203 implements MigrationInterface {
    name = 'InitialMigration1683212899203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "box" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "coachId" integer, CONSTRAINT "PK_1a95bae3d12a9f21be6502e8a8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coach" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a1583a1abd23efb2f821c096780" UNIQUE ("email"), CONSTRAINT "PK_c2ca0875fe0755b197d0147713d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "box" ADD CONSTRAINT "FK_3aa6eb102e6932f386e49feafce" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "box" DROP CONSTRAINT "FK_3aa6eb102e6932f386e49feafce"`);
        await queryRunner.query(`DROP TABLE "coach"`);
        await queryRunner.query(`DROP TABLE "box"`);
    }

}
