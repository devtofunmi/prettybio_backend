import { SignJWT, jwtVerify, errors } from "jose";

const secretStr = process.env.JWT_SECRET;
if (!secretStr || secretStr.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters long.");
}
const secret = new TextEncoder().encode(secretStr);

export interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

//  Sign Access Token (short-lived)
export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "15m") // default: 15 minutes
    .sign(secret);
}

//  Sign Refresh Token (long-lived)
export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || "7d") // default: 7 days
    .sign(secret);
}

// 🔍 Verify Token
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log(" Verifying token:", token);
    }

    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      console.error("Token has expired.");
      throw new Error("Token expired");
    }

    console.error(" JWT verification failed:", err);
    throw new Error("Invalid token or error verifying the token.");
  }
};
