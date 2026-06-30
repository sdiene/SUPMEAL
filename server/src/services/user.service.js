import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
const SALT_ROUNDS = 10;
export async function updateProfile(userId, { name, diet, allergies, defaultPortions }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      diet,
      allergies,
      defaultPortions: defaultPortions !== undefined ? Number(defaultPortions) : undefined,
    },
  });
}
export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user.password) throw new Error("OAUTH_ONLY_ACCOUNT");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("INVALID_CURRENT_PASSWORD");
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}
