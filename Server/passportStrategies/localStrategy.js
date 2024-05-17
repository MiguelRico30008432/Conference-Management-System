const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Corrected import
const bcrypt = require('bcrypt');
const db = require("../utility/database");

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await db.fetchData("users", "userid", id);
        if (!findUser[0]) {
            throw new Error("User Not Found");
        }
        const userInfo = {
            "userid": findUser[0].userid,
            "useremail": findUser[0].useremail,
            "useradmin": findUser[0].useradmin
        };
        done(null, userInfo);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new LocalStrategy({
    usernameField: 'email' // Correctly configured options object
    },
    async (email, password, done) => { // Correct parameters: 'email' instead of 'username' due to the custom field
        try {
            console.log('debug')
            const findUser = await db.fetchData("users", "useremail", email); 
            consoel.log(email,password , findUser)
            done(null, findUser[0]);
        } catch (err) {
            done(err);
        }
    })
);