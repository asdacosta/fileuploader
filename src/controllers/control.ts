import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user || user.password !== password) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const deserialize = async (id, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
};

const getHome = async (req, res) => {
  return res.render("index");
};

export { localStrategy, deserialize, getHome };
