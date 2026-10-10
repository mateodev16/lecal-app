import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config.js";

export interface JwtPayload {
  sub: string; // user id
  email: string;
}

export function signAuthToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (typeof decoded.sub !== "string") return null;
    return { sub: decoded.sub, email: typeof decoded.email === "string" ? decoded.email : "" };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = "lecal_token";