import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY || 'secret';

export type UserPayload = {
    id: number,
    username: string
    email: string,
}

export const generateToken = (payload: UserPayload):string => {
    return jwt.sign(payload, secretKey, { expiresIn: "1d" });
}

export const verifyToken = (token: string): UserPayload | null => {
    try {
        return jwt.verify(token, secretKey) as UserPayload;
    } catch (e) {
        return null;
    }
}
