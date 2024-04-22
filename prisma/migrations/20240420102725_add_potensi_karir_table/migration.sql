-- CreateTable
CREATE TABLE "potensi_karir" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(255) NOT NULL,

    CONSTRAINT "potensi_karir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "potensi_karir_nama_key" ON "potensi_karir"("nama");
