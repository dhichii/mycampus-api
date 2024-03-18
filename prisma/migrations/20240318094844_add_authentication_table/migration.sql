-- CreateTable
CREATE TABLE "authentication" (
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL,

    CONSTRAINT "authentication_pkey" PRIMARY KEY ("token")
);
