-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('Menunggu', 'Diproses', 'Ditolak', 'Lulus');

-- CreateTable
CREATE TABLE "pendaftaran" (
    "id" VARCHAR(255) NOT NULL,
    "id_pendaftar" TEXT NOT NULL,
    "id_prodi" TEXT NOT NULL,
    "jalur_pendaftaran" TEXT NOT NULL,
    "status" "StatusPendaftaran" NOT NULL DEFAULT 'Menunggu',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pendaftaran_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_id_pendaftar_fkey" FOREIGN KEY ("id_pendaftar") REFERENCES "pendaftar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_id_prodi_fkey" FOREIGN KEY ("id_prodi") REFERENCES "prodi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
