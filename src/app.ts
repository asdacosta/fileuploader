import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
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

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, "../public");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ongoing on ${PORT} now!`);
});
