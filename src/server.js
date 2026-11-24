const express = require("express");
const logger = require("./logger");

const app = express();

const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

const tasks=new Map();
let nextTaskId=1;

app.post("/api/users",(req,res)=>{
    logger.info("POST /api/users calles");

    const {name,age} = req.body;
    if(!name || !age){
        logger.warn("Missing reuqired feilds");

        return res.status(400).json({
            success:false,
            message:"Name and age are required"
        });
    }
    return res.status(200).json({
        success:true,
        message:"user created successfully",
        user: {
            name,
            age
        }
    });
});


app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});