-- CreateEnum
CREATE TYPE "Jenis_Universitas" AS ENUM ('NEGERI', 'SWASTA');

-- CreateTable
CREATE TABLE "universitas" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "jenis" "Jenis_Universitas" NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "logo_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "universitas_pkey" PRIMARY KEY ("id")
);
