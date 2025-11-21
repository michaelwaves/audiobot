import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "@/node_modules/@types/pg";
import { DB } from "./schema";


const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DATABASE_URL!,
        max: 10
    })
})

export const db = new Kysely<DB>({ dialect })