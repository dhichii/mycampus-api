-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR', 'PENDAFTAR', 'SEKOLAH');

-- CreateEnum
CREATE TYPE "Jenis_Kelamin" AS ENUM ('L', 'P');

-- CreateTable
CREATE TABLE "akun" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "akun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jenis_kelamin" "Jenis_Kelamin" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operator" (
    "id" VARCHAR(255) NOT NULL,
    "id_universitas" INTEGER NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jenis_kelamin" "Jenis_Kelamin" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendaftar" (
    "id" VARCHAR(255) NOT NULL,
    "id_sekolah" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jenis_kelamin" "Jenis_Kelamin" NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "asal_daerah" VARCHAR(255) NOT NULL,
    "no_hp" VARCHAR(20) NOT NULL,
    "no_wa" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pendaftar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pihak_sekolah" (
    "id" VARCHAR(255) NOT NULL,
    "id_sekolah" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jabatan" VARCHAR(120) NOT NULL,
    "jenis_kelamin" "Jenis_Kelamin" NOT NULL,
    "no_hp" VARCHAR(20) NOT NULL,
    "no_wa" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pihak_sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "akun_email_key" ON "akun"("email");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator" ADD CONSTRAINT "operator_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator" ADD CONSTRAINT "operator_id_universitas_fkey" FOREIGN KEY ("id_universitas") REFERENCES "universitas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pihak_sekolah" ADD CONSTRAINT "pihak_sekolah_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pihak_sekolah" ADD CONSTRAINT "pihak_sekolah_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
