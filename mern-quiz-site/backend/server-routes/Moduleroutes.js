const express = require('express');
const router = express.Router();
const User = require('../mongo-models/Userlist');
const { Module } = require('../mongo-models/Modules');

//add a new module to the system
router.post('/addnewmodule', async (req, res) => {
    const { title, teacher, code, weeks } = req.body;

    //assign a random color from the list
    const colors = ["red", "green", "orange", "yellow", "blue"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (!title || !teacher || !code || !weeks) {
        return res.status(406).send('406-Not Acceptable: Missing required module details');
    }
    try {
        const existingModule = await Module.findOne({ code });
        if (existingModule) {
            return res.status(409).send('409-Conflict: Module with this code already exists');
        }
        const newModule = new Module({ title, teacher, code, weeks, color: randomColor });
        await newModule.save();
        res.status(201).send(`201-Created: Module "${title}" added successfully`);
        console.log(`Module "${title}" added with code "${code}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//add a module to a users account
router.put('/assignmodule', async (req, res) => {
    const { email, moduleCode } = req.body;
    if (!email || !moduleCode) {
        return res.status(406).send('406-Not Acceptable: Missing Email or Module Code');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        if (!user.modules) {
            user.modules = [];
        }
        if (user.modules.includes(moduleCode)) {
            return res.status(409).send('409-Conflict: User already enrolled in this module');
        }
        user.modules.push(moduleCode);
        await user.save();
        res.status(200).send(`200-OK: Module "${moduleCode}" added to user "${email}"`);
        console.log(`Module "${moduleCode}" added to ${email}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//find the modules that a user is on
router.get('/usermodules', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(406).send('406-Not Acceptable: Missing Email');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        res.status(200).json({ modules: user.modules });
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//removing a module from a user
router.delete('/removeusermodule', async (req, res) => {
    const { email, moduleCode } = req.body;
    if (!email || !moduleCode) {
        return res.status(406).send('406-Not Acceptable: Missing Email or Module Code');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        if (!user.modules || !user.modules.includes(moduleCode)) {
            return res.status(404).send('404-Not Found: Module not found for user');
        }
        user.modules = user.modules.filter(mod => mod !== moduleCode);
        await user.save();
        res.status(200).send(`200-OK: Module "${moduleCode}" removed from user "${email}"`);
        console.log(`Module "${moduleCode}" removed from ${email}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});


//update a module's teacher
router.put('/editmoduleteacher', async (req, res) => {
    const { moduleCode, newTeacher } = req.body;
    if (!moduleCode || !newTeacher) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code or New Teacher');
    }
    try {
        const module = await Module.findOne({ code: moduleCode });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        module.teacher = newTeacher;
        await module.save();
        res.status(200).send(`200-OK: Teacher for module "${moduleCode}" updated to "${newTeacher}"`);
        console.log(`Teacher for module "${moduleCode}" updated to "${newTeacher}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//update a module's status
router.put('/editmodulestatus', async (req, res) => {
    const { moduleCode, newStatus } = req.body;
    if (!moduleCode || !newStatus) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code or New Status');
    }
    try {
        const module = await Module.findOne({ code: moduleCode });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        module.status = newStatus;
        await module.save();
        res.status(200).send(`200-OK: Status for module "${moduleCode}" updated to "${newStatus}"`);
        console.log(`Status for module "${moduleCode}" updated to "${newStatus}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//delete a module from the system and remove it from all users
router.delete('/deletemodule', async (req, res) => {
    const { moduleCode } = req.body;

    //validate required fields
    if (!moduleCode) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code');
    }

    try {
        const moduleResult = await Module.deleteOne({ code: moduleCode });
        if (moduleResult.deletedCount === 0) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }

        //remove the module from all users
        const userResult = await User.updateMany(
            { modules: moduleCode },
            { $pull: { modules: moduleCode } }
        );

        res.status(200).send(`200-OK: Module "${moduleCode}" deleted and removed from ${userResult.modifiedCount} users`);
        console.log(`Module "${moduleCode}" deleted and removed from ${userResult.modifiedCount} users`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//get a modules information
router.post('/getmodule', async (req, res) => {
    const { moduleCode } = req.body;
    if (!moduleCode) {
        return res.status(406).send('406-Not Acceptable: Missing module Code');
    }
    try {
        const module = await Module.findOne({ code: moduleCode });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        res.status(200).json({ code: module.code, title: module.title, teacher: module.teacher, color: module.color, status: module.status });
        console.log(`Module "${moduleCode}" information retrieved`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

module.exports = router;