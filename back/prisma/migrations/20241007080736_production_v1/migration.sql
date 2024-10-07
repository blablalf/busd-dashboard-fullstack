-- CreateTable
CREATE TABLE "ApiData" (
    "id" SERIAL NOT NULL,
    "lastBlockFetched" BIGINT NOT NULL,

    CONSTRAINT "ApiData_pkey" PRIMARY KEY ("id")
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
    "value" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTransfers" (
    "date" TIMESTAMP(3) NOT NULL,
    "totalTransfers" TEXT NOT NULL,

    CONSTRAINT "DailyTransfers_pkey" PRIMARY KEY ("date")
);
