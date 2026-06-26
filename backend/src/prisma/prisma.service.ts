import { Injectable } from "@nestjs/common";
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaNeon({
            connectionString: process.env.DIRECT_URL!,
        });
        super({ adapter });
    }
}