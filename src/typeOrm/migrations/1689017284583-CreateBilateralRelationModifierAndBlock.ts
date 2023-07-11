import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBilateralRelationModifierAndBlock1689017284583 implements MigrationInterface {
    name = 'CreateBilateralRelationModifierAndBlock1689017284583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668"`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "coachId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_1b703e2df235e86efe1faa373a2"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ALTER COLUMN "modifierId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_1b703e2df235e86efe1faa373a2" FOREIGN KEY ("modifierId") REFERENCES "modifier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_1b703e2df235e86efe1faa373a2"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ALTER COLUMN "modifierId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_1b703e2df235e86efe1faa373a2" FOREIGN KEY ("modifierId") REFERENCES "modifier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercise" ALTER COLUMN "coachId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_8a2cd89e9bfd7a0cd088cab4668" FOREIGN KEY ("coachId") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
