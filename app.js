const express = require("express");
const app = express();
const cors = require("cors");
require("./connection/connection")
const auth = require("./routes/auth");
const list = require("./routes/list");
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello  World ");
})

app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});