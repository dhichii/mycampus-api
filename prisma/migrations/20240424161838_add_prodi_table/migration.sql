-- CreateEnum
CREATE TYPE "Jenjang" AS ENUM ('D1', 'D2', 'D3', 'S1', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "Status_Prodi" AS ENUM ('Aktif', 'Tutup');

-- CreateTable
CREATE TABLE "prodi" (
    "id" VARCHAR(255) NOT NULL,
    "id_universitas" INTEGER NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "kode_prodi" INTEGER NOT NULL,
    "jenjang" "Jenjang" NOT NULL,
    "status" "Status_Prodi" NOT NULL,
    "akreditasi" TEXT NOT NULL,
    "biaya_pendaftaran" DOUBLE PRECISION NOT NULL,
    "ukt" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prodi_potensi_karir" (
    "id_prodi" TEXT NOT NULL,
    "id_potensi_karir" INTEGER NOT NULL,

    CONSTRAINT "prodi_potensi_karir_pkey" PRIMARY KEY ("id_prodi","id_potensi_karir")
);

-- AddForeignKey
ALTER TABLE "prodi" ADD CONSTRAINT "prodi_id_universitas_fkey" FOREIGN KEY ("id_universitas") REFERENCES "universitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prodi_potensi_karir" ADD CONSTRAINT "prodi_potensi_karir_id_prodi_fkey" FOREIGN KEY ("id_prodi") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prodi_potensi_karir" ADD CONSTRAINT "prodi_potensi_karir_id_potensi_karir_fkey" FOREIGN KEY ("id_potensi_karir") REFERENCES "potensi_karir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
