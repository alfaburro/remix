import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient | undefined;
}

const config = require("platformsh-config").config();

if (config.isValidPlatform() && !config.inBuild()) {

  // Platform.sh database configuration.
  try {
    const dbRelationship = "pgdb";
    const credentials = config.credentials(dbRelationship);
    console.log(`Using Platform.sh configuration with relationship ${dbRelationship}.`);
  
    const pool = {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 600000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 20000,
      reapIntervalMillis: 20000,
      createRetryIntervalMillis: 200,
    };
  
    const connection = {
      connection: {
        client: "postgres",
        connection: {
          host: credentials.ip,
          port: credentials.port,
          database: credentials.path,
          user: credentials.username,
          password: credentials.password,
          ssl: false
        },
        debug: false,
        pool
      },
    };
  
  }
  catch (e) {
  // Do nothing if 'pgdb' relationship isn't found.
  // Database configuration falls back on the SQLite defaults.
  }
}
if (config.isValidPlatform()) {
  // Build hook configuration message.
  console.log('Using default configuration during Platform.sh build hook until relationships are available.');
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// In production, we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
