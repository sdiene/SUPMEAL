import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("NO_EMAIL_FROM_GOOGLE"));
        let user = await prisma.user.findFirst({
          where: { oauthProvider: "google", oauthId: profile.id },
        });
        if (!user) {
          user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { oauthProvider: "google", oauthId: profile.id },
            });
          } else {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || email.split("@")[0],
                oauthProvider: "google",
                oauthId: profile.id,
              },
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
export default passport;
