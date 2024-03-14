-- CreateTable
CREATE TABLE "sekolah" (
    "id" VARCHAR(255) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sekolah_nama_key" ON "sekolah"("nama");
