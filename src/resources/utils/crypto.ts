import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export default { hashPassword, verifyPassword };
