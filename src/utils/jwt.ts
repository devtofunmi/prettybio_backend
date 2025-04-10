import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signAccessToken(payload: any) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || "15m")
      .sign(secret);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error("Error signing access token: " + err.message);
    }
    throw new Error("Error signing access token: Unknown error occurred.");
  }
}

export async function signRefreshToken(payload: any) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY || "7d")
      .sign(secret);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error("Error signing refresh token: " + err.message);
    }
    throw new Error("Error signing refresh token: Unknown error occurred.");
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    // Error handling, can log or throw a specific error based on the type
    if (err instanceof Error && err.message.includes("jwt expired")) {
      throw new Error("Token has expired.");
    }
    throw new Error("Invalid token or error verifying the token.");
  }
}

