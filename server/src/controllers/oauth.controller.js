import { generateToken } from "../services/auth.service.js";
export function googleCallback(req, res) {
  const token = generateToken(req.user);
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/oauth-callback?token=${token}`);
}
