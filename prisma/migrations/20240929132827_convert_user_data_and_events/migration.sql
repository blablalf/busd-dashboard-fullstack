-- CreateTable
CREATE TABLE "ApiData" (
    "lastBlockFetched" BIGINT NOT NULL,

    CONSTRAINT "ApiData_pkey" PRIMARY KEY ("lastBlockFetched")
);

-- CreateTable
CREATE TABLE "UserData" (
    "userAddress" TEXT NOT NULL,
    "userBalance" BIGINT,
    "userTokenBalance" BIGINT,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("userAddress")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "owner" TEXT,
    "spender" TEXT,
    "value" BIGINT,
    "blockNumber" BIGINT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
