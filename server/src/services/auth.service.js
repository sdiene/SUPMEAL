import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/mailer.js";
const SALT_ROUNDS = 10;
export async function registerUser({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_TAKEN");
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      verifyToken,
      verifyTokenExpiry,
      emailVerified: false,
    },
  });
  try {
    await sendVerificationEmail(email, verifyToken);
    return { user, emailSent: true };
  } catch (emailErr) {
    console.error("Email non envoye:", emailErr.message);
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null, verifyTokenExpiry: null },
    });
    return { user: verifiedUser, emailSent: false };
  }
}
export async function verifyEmail(token) {
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new Error("INVALID_OR_EXPIRED_TOKEN");

  return prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    },
  });
}
export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

  return user;
}
export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
export function sanitizeUser(user) {
  const { password, verifyToken, verifyTokenExpiry, ...safe } = user;
  return safe;
}

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.password) throw new Error("OAUTH_ONLY_ACCOUNT");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  await sendPasswordResetEmail(email, resetToken);
}

export async function resetPassword(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new Error("INVALID_OR_EXPIRED_TOKEN");

  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
}
