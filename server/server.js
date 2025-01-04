const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mysqlPool = require("./config/db");
const cors = require("cors");
// rest object
dotenv.config();
const app = express();

app.use(cors());
//middleware
app.use(express.json());
app.use(morgan("dev"));
// routes
app.use("/api/v1/student",require("./routes/studentsRoutes") );
app.get("/test", (req, res) => {
    res.status(200).json({
        message: "Hello World"
    });
});
 
//PORT
const PORT = process.env.PORT||8000;

mysqlPool.query('SELECT 1').then(()=>{
    //MY SQL
    console.log("Connected to MySQL");
//run listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
})
.catch((err)=>{
    console.log(err);
})

