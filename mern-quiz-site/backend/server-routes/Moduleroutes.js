const express = require('express');
const router = express.Router();
const User = require('../mongo-models/Userlist');
const { Module } = require('../mongo-models/Modules');

//add a new module to the system
router.post('/addnewmodule', async (req, res) => {
    const { title, teacher, code, weeks, year } = req.body;

    //assign a random color from the list
    const colors = ["red", "green", "orange", "yellow", "blue", "purple"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (!title || !teacher || !code || !weeks || !year) {
        return res.status(406).send('406-Not Acceptable: Missing required module details');
    }
    try {
        const existingModule = await Module.findOne({ code });
        if (existingModule) {
            return res.status(409).send('409-Conflict: Module with this code already exists');
        }
        const newModule = new Module({ title, teacher, code, weeks, year, color: randomColor });
        await newModule.save();
        res.status(201).send(`201-Created: Module "${title}" added successfully`);
        console.log(`Module "${title}" added with code "${code} for year ${year}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//add a module to a users account
router.put('/assignmodule', async (req, res) => {
    const { email, moduleCode, moduleYear } = req.body;
    if (!email || !moduleCode || !moduleYear) {
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
        const moduleIdentifier = moduleCode + moduleYear;
        if (user.modules.includes(moduleIdentifier)) {
            return res.status(409).send('409-Conflict: User already enrolled in this module');
        }
        user.modules.push(moduleIdentifier);
        await user.save();
        res.status(200).send(`200-OK: Module "${moduleCode}" for year "${moduleYear}" added to user "${email}"`);
        console.log(`Module "${moduleCode}" for year "${moduleYear}" added to ${email}`);
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
    const { email, moduleCode, moduleYear } = req.body;
    if (!email || !moduleCode || !moduleYear) {
        return res.status(406).send('406-Not Acceptable: Missing Email, Module Code, or Module Year');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('404-Not Found: User does not exist');
        }
        const moduleIdentifier = moduleCode + moduleYear;
        if (!user.modules || !user.modules.includes(moduleIdentifier)) {
            return res.status(404).send('404-Not Found: Module not found for user');
        }
        user.modules = user.modules.filter(mod => mod !== moduleIdentifier);
        await user.save();
        res.status(200).send(`200-OK: Module "${moduleCode} - ${moduleYear}" removed from user "${email}"`);
        console.log(`Module "${moduleCode} - ${moduleYear}" removed from ${email}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//update a module's teacher
router.put('/editmoduleteacher', async (req, res) => {
    const { moduleCode, moduleYear, newTeacher } = req.body;
    if (!moduleCode || !moduleYear || !newTeacher) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code or New Teacher');
    }
    try {
        const module = await Module.findOne({ code: moduleCode, year: moduleYear });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        module.teacher = newTeacher;
        await module.save();
        res.status(200).send(`200-OK: Teacher for module "${moduleCode} - ${moduleYear}" updated to "${newTeacher}"`);
        console.log(`Teacher for module "${moduleCode} - ${moduleYear}" updated to "${newTeacher}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//update a module's status
router.put('/editmodulestatus', async (req, res) => {
    const { moduleCode, moduleYear, newStatus } = req.body;
    if (!moduleCode || !moduleYear || !newStatus) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code, Module Year, or New Status');
    }
    try {
        const module = await Module.findOne({ code: moduleCode, year: moduleYear });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        module.status = newStatus;
        await module.save();
        res.status(200).send(`200-OK: Status for module "${moduleCode} - ${moduleYear}" updated to "${newStatus}"`);
        console.log(`Status for module "${moduleCode} - ${moduleYear}" updated to "${newStatus}"`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//delete a module from the system and remove it from all users
router.delete('/deletemodule', async (req, res) => {
    const { moduleCode, moduleYear } = req.body;

    //validate required fields
    if (!moduleCode || !moduleYear) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code or Module Year');
    }

    try {
        const moduleResult = await Module.deleteOne({ code: moduleCode, year: moduleYear });
        if (moduleResult.deletedCount === 0) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }

        //remove the module from all users
        const moduleIdentifier = moduleCode + moduleYear;
        const userResult = await User.updateMany(
            { modules: moduleIdentifier },
            { $pull: { modules: moduleIdentifier } }
        );

        res.status(200).send(`200-OK: Module "${moduleCode} - ${moduleYear}" deleted and removed from ${userResult.modifiedCount} users`);
        console.log(`Module "${moduleCode} - ${moduleYear}" deleted and removed from ${userResult.modifiedCount} users`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

//get a module's information
router.post('/getmodule', async (req, res) => {
    const { moduleCode, moduleYear } = req.body;
    if (!moduleCode || !moduleYear) {
        return res.status(406).send('406-Not Acceptable: Missing Module Code or Module Year');
    }
    try {
        const module = await Module.findOne({ code: moduleCode, year: moduleYear });
        if (!module) {
            return res.status(404).send('404-Not Found: Module does not exist');
        }
        res.status(200).json({ 
            code: module.code, 
            title: module.title, 
            teacher: module.teacher, 
            color: module.color, 
            status: module.status 
        });
        console.log(`Module "${moduleCode} - ${moduleYear}" information retrieved`);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error');
    }
});

module.exports = router;