-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR', 'PENDAFTAR', 'SEKOLAH');

-- CreateEnum
CREATE TYPE "Jenis_Kelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU', 'NONE');

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
    "nisn" VARCHAR(50) NOT NULL,
    "nik" INTEGER NOT NULL,
    "jenis_kelamin" "Jenis_Kelamin" NOT NULL,
    "kewarganegaraan" VARCHAR(50) NOT NULL,
    "tempat_lahir" VARCHAR(255) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "agama" "Agama" NOT NULL,
    "alamat_jalan" VARCHAR(255) NOT NULL,
    "rt" VARCHAR(4) NOT NULL,
    "rw" VARCHAR(4) NOT NULL,
    "kelurahan" VARCHAR(100) NOT NULL,
    "kecamatan" VARCHAR(100) NOT NULL,
    "provinsi" VARCHAR(100) NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "pendaftar_nisn_key" ON "pendaftar"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftar_nik_key" ON "pendaftar"("nik");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator" ADD CONSTRAINT "operator_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator" ADD CONSTRAINT "operator_id_universitas_fkey" FOREIGN KEY ("id_universitas") REFERENCES "universitas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftar" ADD CONSTRAINT "pendaftar_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pihak_sekolah" ADD CONSTRAINT "pihak_sekolah_id_sekolah_fkey" FOREIGN KEY ("id_sekolah") REFERENCES "sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pihak_sekolah" ADD CONSTRAINT "pihak_sekolah_id_fkey" FOREIGN KEY ("id") REFERENCES "akun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
