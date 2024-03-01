-- CreateTable
CREATE TABLE "universitas" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "logo_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "universitas_pkey" PRIMARY KEY ("id")
);
