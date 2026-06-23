import { Injectable } from "@nestjs/common";
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaNeon({
            connectionString: process.env.DATABASE_URL!,
        });
        super({ adapter });
    }
}