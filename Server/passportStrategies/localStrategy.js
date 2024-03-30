const passport = require('passport');
const Strategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require("../utility/database");

passport.serializeUser((user, done) =>{
    done(null, user.userid);
})

passport.deserializeUser(async (id, done) =>{
    try{
        const findUser = await db.fetchData("users", "userid", id);

        if (!findUser[0]) {
            throw new Error("User Not Found");
        }

        const userInfo = { "userid": findUser[0].userid, "username": findUser[0].username, "useremail": findUser[0].useremail, "useradmin": findUser[0].useradmin};

        done(null, userInfo);

    }catch(err){
        done (err, null);
    }
})

module.exports = passport.use(
    new Strategy(async (username, password, done) =>{

        try{
            const findUser = await db.fetchData("users", "username", username);

            if (!findUser[0]) {
                throw new Error("User Not Found");
            }
            
            bcrypt.compare(password, findUser[0].userpassword, function(err, result) {
                if (result == true){ 
                    done(null, findUser[0]);
                } else {
                    done("Invalid Credentials", null);
                }
            });

        }catch(err){
            done(err, null)
        }
    })
)