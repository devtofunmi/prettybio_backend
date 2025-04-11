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

export const verifyToken = async (token: string) => {
  try {
    console.log("Incoming token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new Error("Invalid token or error verifying the token.");
  }
};




