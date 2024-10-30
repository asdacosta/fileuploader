import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import { validationResult, body } from "express-validator";
import pkg from "bcryptjs";
const { hash, compare } = pkg;

const prisma = new PrismaClient();

const signUpValidation = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isAlpha()
    .withMessage("Name must contain only letters."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isAlpha()
    .withMessage("Name must contain only letters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Kindly enter a valid email.")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) throw new Error("Email already in use.");
      return true;
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 chars.")
    .matches(/\d/)
    .withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain special char.")
    .escape(),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords don't match.");
    }
    return true;
  }),
];

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return done(null, false, { message: "Incorrect username" });

      const match = await compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const deserialize = async (user, done) => {
  try {
    const foundUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!foundUser) return done(null, false);
    done(null, foundUser);
  } catch (error) {
    done(error);
  }
};

const getHome = async (req, res) => {
  return res.render("index", { user: req.user });
};

const postSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error here!");
    return res.render("sign-up", {
      errors: errors.array(),
      FormData: req.body,
    });
  }

  try {
    hash(req.body.password, 10, async (err, hashedPwd) => {
      if (err) return next(err);
      await prisma.user.create({
        data: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hashedPwd,
        },
      });
    });
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    return res.render("index", { user });
  } catch (error) {
    return next(error);
  }
};

const getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

const allUsers = await prisma.user.findMany();
console.log(allUsers);

export {
  localStrategy,
  deserialize,
  getHome,
  postSignUp,
  signUpValidation,
  getLogOut,
};
