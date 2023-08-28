const User = require("./models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) throw err;
                if (!user)
                    return done(null, false, {
                        message: "No user with that username",
                    });
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                        console.log("user", user);
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Password Incorrect",
                        });
                    }
                });
            });
        })
    );

    passport.use(
        new GoogleStrategy(
            {
                // options for google strategy
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "https://tryfingo.com/auth/login-google/callback", //google callback url, same as the one added in Google API page
            },
            function (accessToken, refreshToken, profile, done) {
                // passport callback function
                // Eg: Register user here.

                // console.log("profile", profile);
                const email = profile.emails[0].value;
                const displayName = profile.displayName;
                const username = email;
                // console.log('username', username);

                ////checking if another user with same username already exists
                User.findOne({ username: username }, async (err, doc) => {
                    if (err) throw err;
                    if (doc) {
                        return done(null, doc);
                    }

                    if (!doc) {
                        User.findOne({ email: email }, async (err, doc) => {
                            if (err) throw err;
                            if (doc) {
                                return done(null, doc);
                            } else {
                                const newUser = new User({
                                    username: username,
                                    displayName: displayName,
                                    email: email,
                                    role: "basic",
                                });
                                await newUser.save();
                                console.log("user", newUser);
                                return done(null, newUser);
                            }
                        });
                    }
                });
            }
        )
    );

    passport.serializeUser((user, cb) => {
        // stores a cookie inside the browser
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        // takes the cookie and return the user
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                imgPath: user.imgPath,
                score: user.score,
                last_played: user.last_played,
                role: user.role,
                streak: user.streak,
                lastCompletedDay: user.lastCompletedDay,
                xp: user.xp,
            };
            cb(err, userInformation);
        });
    });
};
