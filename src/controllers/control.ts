import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient, User } from "@prisma/client";
import { validationResult, body } from "express-validator";
import pkg from "bcryptjs";
const { hash, compare } = pkg;
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
dotenv.config();

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
  return res.render("index", { user: req.user, uploadMessage: "" });
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
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });
    return res.render("index", { user, uploadMessage: "" });
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

const getFolder = async (req, res) => {
  const files = await prisma.file.findMany({
    select: { fileUrl: true, folder: true },
  });

  res.render("folder", {
    folder: req.params.folder,
    uploadMessage: "",
    user: req.user,
    files,
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "pdf", "jpeg"],
  } as any,
});

const upload = multer({ storage });

const postFolder = async (req, res) => {
  const files = await prisma.file.findMany({
    select: { fileUrl: true },
  });

  if (!req.file) {
    return res.status(400).render("folder", {
      folder: req.params.folder,
      uploadMessage: "No file uploaded.",
      files,
    });
  }

  if (!req.user) {
    return res.status(401).render("folder", {
      folder: req.params.folder,
      uploadMessage: "User not authenticated.",
      files,
    });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: (req.user as User).email,
    },
  });

  if (!foundUser) {
    return res.status(404).render("folder", {
      folder: req.params.folder,
      uploadMessage: "User not found.",
      files,
    });
  }

  await prisma.file.create({
    data: {
      userId: foundUser.id,
      fileUrl: req.file.path,
      folder: req.params.folder,
    },
  });
  res.render("folder", {
    folder: req.params.folder,
    uploadMessage: "File uploaded successfully!",
    files,
  });
};

const getDetails = async (req, res) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      email: (req.user as User).email,
    },
  });
  const fileDetails = await prisma.file.findFirst({
    where: {
      userId: foundUser?.id,
    },
  });
  res.render("details", {
    user: foundUser,
    details: fileDetails,
  });
};

export {
  localStrategy,
  deserialize,
  getHome,
  postSignUp,
  signUpValidation,
  getLogOut,
  getFolder,
  postFolder,
  upload,
  getDetails,
};
