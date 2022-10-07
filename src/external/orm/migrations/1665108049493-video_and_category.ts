import { MigrationInterface, QueryRunner } from 'typeorm';

export class videoAndCategory1665108049493 implements MigrationInterface {
  name = 'videoAndCategory1665108049493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video" ("id" uuid NOT NULL, "user_id" character varying NOT NULL, "filename" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "thumbnail" character varying, "public" boolean NOT NULL DEFAULT true, "likes" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_category" ("video_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_cc62e048b65b8f04c42fb0da681" PRIMARY KEY ("video_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d83b15ecbcacbf364d2ffb4eb6" ON "video_category" ("video_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_979641be8f6260d61483ccf83c" ON "video_category" ("category_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "video_category" ADD CONSTRAINT "FK_d83b15ecbcacbf364d2ffb4eb67" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_category" ADD CONSTRAINT "FK_979641be8f6260d61483ccf83cc" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video_category" DROP CONSTRAINT "FK_979641be8f6260d61483ccf83cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_category" DROP CONSTRAINT "FK_d83b15ecbcacbf364d2ffb4eb67"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_979641be8f6260d61483ccf83c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d83b15ecbcacbf364d2ffb4eb6"`,
    );
    await queryRunner.query(`DROP TABLE "video_category"`);
    await queryRunner.query(`DROP TABLE "video"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
