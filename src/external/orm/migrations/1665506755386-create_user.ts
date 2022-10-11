import { MigrationInterface, QueryRunner } from "typeorm";

export class createUser1665506755386 implements MigrationInterface {
    name = 'createUser1665506755386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "photo" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_0c06b8d2494611b35c67296356c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_0c06b8d2494611b35c67296356c"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
