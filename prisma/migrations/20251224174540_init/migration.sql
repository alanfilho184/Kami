-- CreateEnum
CREATE TYPE "Ban_Type" AS ENUM ('TEMPORARY', 'PERMANENT', 'UNBANNED');

-- CreateEnum
CREATE TYPE "Available_Languages" AS ENUM ('PT_BR', 'EN_US');

-- CreateEnum
CREATE TYPE "Bot_Command_Type" AS ENUM ('TEXT', 'BUTTON', 'CONTEXT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "discord_id" TEXT,
    "username" TEXT,
    "avatar" TEXT,
    "email" TEXT,
    "password" TEXT,
    "is_beta" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_users" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ban_count" INTEGER NOT NULL,
    "actual_ban" "Ban_Type" NOT NULL,
    "ban_duration" TIMESTAMPTZ NOT NULL,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "irt_sheets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "msg_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "irt_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers_config" (
    "id" SERIAL NOT NULL,
    "server_id" TEXT NOT NULL,
    "language" "Available_Languages" NOT NULL,
    "force_language" BOOLEAN NOT NULL DEFAULT false,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servers_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sheet_name" TEXT NOT NULL,
    "sheet_password" TEXT NOT NULL,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attributes" JSONB NOT NULL,
    "legacy" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "macros" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "macro_name" TEXT NOT NULL,
    "macros" JSONB NOT NULL,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_public" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "macros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_commands_statistics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Bot_Command_Type" NOT NULL,
    "usage_total_count" INTEGER NOT NULL DEFAULT 0,
    "usage_record" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "bot_commands_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_config" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language" "Available_Languages" NOT NULL DEFAULT 'PT_BR',
    "secret_roll" BOOLEAN NOT NULL DEFAULT false,
    "secret_insan" BOOLEAN NOT NULL DEFAULT false,
    "secret_general" BOOLEAN NOT NULL DEFAULT false,
    "secret_sheet" BOOLEAN NOT NULL DEFAULT false,
    "secret_send" BOOLEAN NOT NULL DEFAULT false,
    "default_sheet" INTEGER,
    "last_use" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutorials" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "tags" TEXT[],
    "tutorial" TEXT NOT NULL,

    CONSTRAINT "tutorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "language" "Available_Languages",

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bot_commands_statistics_name_key" ON "bot_commands_statistics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_config_user_id_key" ON "users_config"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutorials_link_key" ON "tutorials"("link");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "resources"("name");

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irt_sheets" ADD CONSTRAINT "irt_sheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irt_sheets" ADD CONSTRAINT "irt_sheets_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheets" ADD CONSTRAINT "sheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "macros" ADD CONSTRAINT "macros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_config" ADD CONSTRAINT "users_config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_config" ADD CONSTRAINT "users_config_default_sheet_fkey" FOREIGN KEY ("default_sheet") REFERENCES "sheets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
