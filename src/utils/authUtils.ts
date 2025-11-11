import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 8;
const JWT_SECRET = process.env.JWT_TOKEN_SECRET || 'adSense-backend-key';

export async function generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
}

export function generateToken(payload: object, expiresIn: string = '1d'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
