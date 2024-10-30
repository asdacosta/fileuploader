import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient, User } from "@prisma/client";
import passport from "passport";
import {
  localStrategy,
  deserialize,
  getHome,
  signUpValidation,
  postSignUp,
  getLogOut,
} from "./controllers/control";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, "../public");
const upload = multer({ dest: path.join(__dirname, "../public/uploads/") });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false }));

if (!process.env.SESSION_SECRET) throw new Error("Session secret not set.");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());

passport.use(localStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(deserialize);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", getHome);
app.get("/sign-up", (_req, res) => res.render("sign-up"));
app.get("/log-in", (_req, res) => res.render("log-in"));
app.get("/log-out", getLogOut);

app.post("/sign-up", signUpValidation, postSignUp);
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);
app.post("/upload", upload.single("upload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).render("index", {
      user: req.user,
      uploadMessage: "No file uploaded.",
    });
  }

  if (!req.user) {
    return res.status(401).render("index", {
      user: null, // or handle user as you see fit
      uploadMessage: "User not authenticated.",
    });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: (req.user as User).email,
    },
  });

  if (!foundUser) {
    return res.status(404).render("index", {
      user: req.user,
      uploadMessage: "User not found.",
    });
  }

  await prisma.file.create({
    data: {
      userId: foundUser.id,
      fileUrl: req.file.path,
    },
  });
  res.render("index", {
    user: req.user,
    uploadMessage: "File uploaded successfully!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ongoing on ${PORT} now!`);
});
