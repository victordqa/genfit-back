import { MigrationInterface, QueryRunner } from 'typeorm';
import { modifiers } from '../seeds/modifiers';
import { Modifier } from '../entities/Modifier';
import { blocks } from '../seeds/blocks';
import { Block } from '../entities/Block';

export class CreateModifiersTable1688499812634 implements MigrationInterface {
  name = 'CreateModifiersTable1688499812634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "modifier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "min_candidates" integer NOT NULL, "max_candidates" integer NOT NULL, CONSTRAINT "UQ_8f06bb4ce538ef437fe650b8be0" UNIQUE ("name"), CONSTRAINT "PK_30c20db2bc7a8c2318b4db0dfc0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "modifier_blocks_block" ("modifierId" integer NOT NULL, "blockId" integer NOT NULL, CONSTRAINT "PK_a3c37556796331e2a53333c3249" PRIMARY KEY ("modifierId", "blockId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9902e0eaab6f0f49874a1322a" ON "modifier_blocks_block" ("modifierId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34c0e49a7d31fc42352fba7fb4" ON "modifier_blocks_block" ("blockId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" DROP CONSTRAINT "FK_367d0ec32705a148c813f3db765"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" ALTER COLUMN "boxId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" ADD CONSTRAINT "FK_367d0ec32705a148c813f3db765" FOREIGN KEY ("boxId") REFERENCES "box"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "modifier_blocks_block" ADD CONSTRAINT "FK_f9902e0eaab6f0f49874a1322a6" FOREIGN KEY ("modifierId") REFERENCES "modifier"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "modifier_blocks_block" ADD CONSTRAINT "FK_34c0e49a7d31fc42352fba7fb44" FOREIGN KEY ("blockId") REFERENCES "block"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    //seed modifiers

    const dbBlocks = await queryRunner.manager.find(Block);

    const modifiersInstances = Object.entries(modifiers).map(
      ([modifierName, modifierDetails]) => {
        const modifierInstance = queryRunner.manager.create<Modifier>(
          Modifier,
          {
            name: modifierName,
            min_candidates: modifierDetails.minCandidates,
            max_candidates: modifierDetails.maxCandidates,
          },
        );

        let modifierAssociations = [];
        Object.entries(blocks).forEach(([blockName, blockDetails]) => {
          if (blockDetails.possibleMods.includes(modifierName)) {
            let [filteredBlock] = dbBlocks.filter((b) => b.name === blockName);
            let modifierAssociationsIds = modifierAssociations.map((m) => m.id);
            if (!modifierAssociationsIds.includes(filteredBlock.id)) {
              modifierAssociations.push(filteredBlock);
            }
          }
        });
        modifierInstance.blocks = modifierAssociations;
        return modifierInstance;
      },
    );
    await queryRunner.manager.save(modifiersInstances);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "modifier_blocks_block" DROP CONSTRAINT "FK_34c0e49a7d31fc42352fba7fb44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "modifier_blocks_block" DROP CONSTRAINT "FK_f9902e0eaab6f0f49874a1322a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" DROP CONSTRAINT "FK_367d0ec32705a148c813f3db765"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" ALTER COLUMN "boxId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainning" ADD CONSTRAINT "FK_367d0ec32705a148c813f3db765" FOREIGN KEY ("boxId") REFERENCES "box"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34c0e49a7d31fc42352fba7fb4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9902e0eaab6f0f49874a1322a"`,
    );
    await queryRunner.query(`DROP TABLE "modifier_blocks_block"`);
    await queryRunner.query(`DROP TABLE "modifier"`);
  }
}
