import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModifierAndTrainningBlockRelation1688752649236 implements MigrationInterface {
    name = 'CreateModifierAndTrainningBlockRelation1688752649236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD "modifierId" integer`);
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ALTER COLUMN "blockId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac" FOREIGN KEY ("blockId") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_1b703e2df235e86efe1faa373a2" FOREIGN KEY ("modifierId") REFERENCES "modifier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_1b703e2df235e86efe1faa373a2"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac"`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ALTER COLUMN "blockId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac" FOREIGN KEY ("blockId") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trainning_block" DROP COLUMN "modifierId"`);
    }

}
