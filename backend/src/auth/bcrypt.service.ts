import * as bcrypt from 'bcrypt';

export class BcryptService {
    private readonly saltRounds = 12; // можно вынести в .env

    async hash(plainPassword: string): Promise<string> {
        return bcrypt.hash(plainPassword, this.saltRounds);
    }

    async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}