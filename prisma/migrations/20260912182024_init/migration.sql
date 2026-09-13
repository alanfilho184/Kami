-- CreateEnum
CREATE TYPE "Ban_Type" AS ENUM ('TEMPORARY', 'PERMANENT', 'UNBANNED');

-- CreateEnum
CREATE TYPE "Available_Languages" AS ENUM ('pt-br', 'en-us');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "AnnouncementMode" AS ENUM ('ALWAYS', 'ONCE', 'INTERVAL');

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
    "sheet_password" TEXT,
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
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action_type" TEXT NOT NULL,
    "action_target" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ActivityStatus" NOT NULL,
    "source_system" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_config" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language" "Available_Languages" NOT NULL DEFAULT 'pt-br',
    "secret_roll" BOOLEAN NOT NULL DEFAULT false,
    "secret_insan" BOOLEAN NOT NULL DEFAULT false,
    "secret_general" BOOLEAN NOT NULL DEFAULT false,
    "secret_sheet" BOOLEAN NOT NULL DEFAULT false,
    "secret_send" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "announcement" (
    "id" SERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "title" TEXT,
    "mode" "AnnouncementMode" NOT NULL DEFAULT 'ONCE',
    "repeat_interval_hours" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements_seen" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "announcement_id" INTEGER NOT NULL,
    "last_seen_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_seen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_last_use_idx" ON "users"("last_use");

-- CreateIndex
CREATE INDEX "irt_sheets_sheet_id_idx" ON "irt_sheets"("sheet_id");

-- CreateIndex
CREATE INDEX "irt_sheets_msg_id_idx" ON "irt_sheets"("msg_id");

-- CreateIndex
CREATE INDEX "irt_sheets_user_id_idx" ON "irt_sheets"("user_id");

-- CreateIndex
CREATE INDEX "sheets_user_id_idx" ON "sheets"("user_id");

-- CreateIndex
CREATE INDEX "idx_sheets_user_sheet_name" ON "sheets"("user_id", "sheet_name");

-- CreateIndex
CREATE INDEX "logs_action_type_timestamp_idx" ON "logs"("action_type", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "users_config_user_id_key" ON "users_config"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutorials_link_key" ON "tutorials"("link");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "resources"("name");

-- CreateIndex
CREATE INDEX "announcement_is_active_priority_idx" ON "announcement"("is_active", "priority");

-- CreateIndex
CREATE INDEX "announcements_seen_user_id_last_seen_date_idx" ON "announcements_seen"("user_id", "last_seen_date");

-- CreateIndex
CREATE UNIQUE INDEX "announcements_seen_user_id_announcement_id_key" ON "announcements_seen"("user_id", "announcement_id");

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
ALTER TABLE "announcements_seen" ADD CONSTRAINT "announcements_seen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements_seen" ADD CONSTRAINT "announcements_seen_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
