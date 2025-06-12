const express = require("express");
const rootRouter = require("./routes/index");
const cors = require('cors')
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json())
app.use("/api/v1",rootRouter);

app.listen(process.env.PORT || 3000);