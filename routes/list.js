const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");


router.post("/addTask", async (req, res) => {
    try {
        const { title, body, email } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const list = new List({ title, body, user: existingUser });
        await list.save();

        existingUser.list.push(list);
        await existingUser.save();

        res.status(200).json({ list });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// update 
router.put("/updateTask/:id", async (req, res) => {
    try {
        const { title, body, email } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedList = await List.findByIdAndUpdate(req.params.id, { title, body }, { new: true });

        if (!updatedList) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task Updated", list: updatedList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete task 
router.delete("/deleteTask/:id", async (req, res) => {
    try {
        const { email, title, body, id } = req.body;

        const existingUser = await User.findById({ id }, { $pull: { list: req.params.id } });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedList = await List.findByIdAndDelete(req.params.id);

        if (!deletedList) {
            return res.status(404).json({ message: "Task not found" });
        }

        existingUser.list = existingUser.list.filter(listId => listId !== req.params.id);
        await existingUser.save();

        res.status(200).json({ message: "Task Deleted", list: deletedList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

//getTasks
router.get("/getTasks/:id", async (req, res) => {
    try {
        const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });

        if (list.length > 0) {
            res.status(200).json({ list });
        } else {
            res.status(200).json({ message: "No tasks found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
