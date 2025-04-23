const express = require('express');
const router = express.Router();
const User = require('../mongo-models/Userlist');

//creating a new user, allows for modules to be added at this stage
router.post('/newuser', async (req, res) => {
    const { email, password, role, modules } = req.body;
    if (!email || !password || !role) {
        return res.status(406).send('406-Not Acceptable: Missing Fields (Email, Password, or Role)');
    }
    try {
        const user = new User({ email, password, role });
        if (modules) {
            //check if there is already a modules array, if not then create one
            if (Array.isArray(modules)) {
                user.modules = modules;
            } else {
                user.modules.push(modules);
            }
        }
        await user.save();
        res.status(201).send(`201-Created: User "${email}" Created`);
        console.log(`User Registered under email: ${email} as a ${role}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//attempt a login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(406).send('406-Not Acceptable: Missing Email or Password');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        if (user.password !== password) {
            return res.status(401).send('401-Unauthorized: Incorrect Password');
        }
        res.status(200).json({ message: `200-OK: User "${email}" successfully logged in` });
        console.log(`User "${email}" logged in successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//change a user's password
router.put('/changepassword', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    //validate required fields
    if (!email || !oldPassword || !newPassword) {
        return res.status(406).send('406-Not Acceptable: Missing Email, Old Password, or New Password');
    }

    try {
        //find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }

        //check if the old password matches
        if (user.password !== oldPassword) {
            return res.status(401).send('401-Unauthorized: Incorrect Old Password');
        }

        //update the password
        user.password = newPassword;
        await user.save();

        res.status(200).send(`200-OK: Password for user "${email}" updated successfully`);
        console.log(`Password updated for user "${email}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//add/change a users prefered name
router.put('/changename', async (req, res) => {
    const { email, name } = req.body;

    //validate required fields
    if (!email || !name) {
        return res.status(406).send('406-Not Acceptable: Missing Email or Name');
    }

    try {
        //find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }

        //update the name
        user.name = name;
        await user.save();

        res.status(200).send(`200-OK: Name for user "${email}" updated successfully`);
        console.log(`Name updated for user "${email}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//remove a user from the system
router.delete('/deleteuser', async (req, res) => {
    const { email , confirmPassword } = req.body;
    if (!email || !confirmPassword) {
        return res.status(406).send('406-Not Acceptable: Missing Email or Password');
    }
    try {
        const result = await User.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).send('404-Not Found: User does not exist');
        }

        if (result.password === confirmPassword) {
            return res.status(401).send('401-Unauthorized: Incorrect Password');
        }

        res.status(200).send(`200-OK: User "${email}" deleted`);
        console.log(`User "${email}" deleted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//get a users information
router.post('/getuser', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(406).send('406-Not Acceptable: Missing Email');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        res.status(200).json({ role: user.role, name: user.name, modules: user.modules });
        console.log(`User "${email}" information retrieved`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

module.exports = router;