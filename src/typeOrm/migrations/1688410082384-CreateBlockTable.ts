import { MigrationInterface, QueryRunner } from 'typeorm';
import { blocks } from '../seeds/blocks';
import { Block } from '../entities/Block';

export class CreateBlockTable1688410082384 implements MigrationInterface {
  name = 'CreateBlockTable1688410082384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "min_duration_in_m" integer NOT NULL, "max_duration_in_m" integer NOT NULL, CONSTRAINT "UQ_4896a330611f3b6bc43ec5e0207" UNIQUE ("name"), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning_block" ADD "blockId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning_block" ADD CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac" FOREIGN KEY ("blockId") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    //seed blocks

    const blocksInstances = Object.entries(blocks).map(([name, details]) => {
      return queryRunner.manager.create<Block>(Block, {
        name,
        min_duration_in_m: details.minDurationInM,
        max_duration_in_m: details.maxDurationInM,
      });
    });
    await queryRunner.manager.save(blocksInstances);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trainning_block" DROP CONSTRAINT "FK_6d3a0042156c821ef4a1e6190ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning_block" DROP COLUMN "blockId"`,
    );
    await queryRunner.query(`DROP TABLE "block"`);
  }
}
