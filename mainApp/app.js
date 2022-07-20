import express from "express";
import { rmSync } from "fs";
const app = express();
import mongoose from "mongoose";
import path from "path";
const __dirname = path.resolve();
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import ejsMate from "ejs-mate";
import { User } from "./models/user.js";
// import { Blog } from "./models/blog.js";
import { captureRejectionSymbol } from "events";
import ExpressError from "./utils/ExpressError.js";
import catchAsync from "./utils/ExpressError.js";
// import Joi from "joi";

mongoose
  .connect("mongodb://localhost:27017/onlineGames")
  .then(() => {
    console.log("Mongo Connection done");
  })
  .catch((err) => {
    console.log("oh no mongo connection error!!!");
    console.log(err);
  });

const sessionConfig = {
  secret: "thisshouldbebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
// app.set('views', './src/views');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get(
  "/",
  catchAsync(async (req, res) => {
    res.render("index.ejs");
  })
);

app.get(
  "/users/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id).populate({ path: "followers" });
    console.log(id);
    console.log(user);
    if (!user) {
      req.flash("error", "Cannot find the user!!");
      return res.redirect("/");
    }
    console.log(user);
    console.log(req.user);
    res.render("profile.ejs", { user });
  })
);

app.get(
  "/users/:id/follow",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (req.user && user !== req.user.username) {
      user.followers.push(req.user);
    }
    await user.save();
    req.flash("success", "Added a follower!!!");
    res.redirect(`/users/${id}`);
  })
);

app.get(
  "/users/:id/:followerId/unfollow",
  catchAsync(async (req, res) => {
    const { id, followerId } = req.params;
    await User.findByIdAndUpdate(followerId, { $pull: { followers: id } });
    req.flash("success", "Unfollowed!");
    res.redirect(`/users/${followerId}`);
  })
);

app.get(
  "/register",
  catchAsync(async (req, res) => {
    res.render("register.ejs");
  })
);

app.get(
  "/login",
  catchAsync(async (req, res) => {
    res.render("login.ejs");
  })
);

app.get(
  "/logout",
  catchAsync(async (req, res) => {
    req.logout(function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      req.flash("success", "Goodbye!!");
      res.redirect("/");
    });
  })
);

app.get(
  "/games",
  catchAsync(async (req, res) => {
    res.render("games.ejs");
  })
);

app.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const user = new User({
        email: req.body.email,
        username: req.body.username,
      });
      const newUser = await User.register(user, req.body.password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Successfully signed up!!");
        res.redirect("/login");
      });
    } catch (err) {
      // console.log(err.message);
      req.flash("error", "Something went wrong!");
      res.redirect("/register");
    }
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome Back!!!");
    // const redirectUrl = req.session.returnTo || "/";
    res.redirect("/login");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!!" } = err;
  if (!err.message) err.message = "Something went wrong!!";
  console.log(err.message);
  res.status(statusCode).render("error", { err });
});

app.listen("3000", (req, res) => {
  console.log("Listening on port 3000!!");
});
