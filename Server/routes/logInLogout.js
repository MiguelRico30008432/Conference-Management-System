const express = require('express');
const router = express.Router(); 
const db = require("../utility/database");
const mail = require("../utility/emails");
const auth = require("../utility/verifications");
const bcrypt = require('bcrypt');
const passport = require('passport');

//Login
router.post("/signIn", passport.authenticate("local", {
    successRedirect: "/", // Redirect on successful authentication
    failureRedirect: "/login", // Redirect on authentication failure
}), (req, res) => {
    res.status(200).send("Authenticated successfully");
});

//User Registration
router.post("/signUp", async (req, res) => {
    const { firstName, lastName, password, email, phone } = req.body;

    try {
        const findUserName = await db.fetchData("users", "useremail", email);
        
        if (!findUserName.length) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                userfirstname: firstName,
                userlastname: lastName,
                useremail: email,
                userphone: phone,
                userpassword: hashedPassword
            };

            await db.addData("users", newUser);

            return res.status(201).send({ msg: "Utilizador criado com sucesso"});
        } else {
            console.log("Utilizador já existe");
            return res.status(409).send({ msg: 'Utilizador já existe' });
        }
    } catch (error) {
        console.error("Erro ao criar o utilizador: ", error);
        return res.status(500).send({ msg: 'Erro interno de servidor', error: error.message });
    }
});

//Logout
router.post("/api/auth/logout", auth.ensureAuthenticated, (request, response)=>{

    request.logout((err)=>{
        if (err) return response.sendStatus(400);
        response.send(200);
    });
});

module.exports = router;