const express = require("express");
const logger = require("./logger");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const emp1={
    id:"emp-101",
    name:"Asha",
    daysLeft:5
}
const emp2={
    id:"emp-102",
    name:"Ravi",
    daysLeft:1
}

const employes=new Map();
employes.set(emp1.id,emp1);
employes.set(emp2.id,emp2);

const leaves=new Map();

export const LeaveController = async(req,res)=>{
    const {employeeId,days,reason}=req.body;
    if(employeeId===undefined || days===undefined || reason===undefined){
        return res.status(400).json({
            success:false,
            message:"ALL Feilds are Required"
        });
    }
    if(typeof employeeId!=="string" ||typeof days!=="number" ||typeof reason!=="string"){
        return res.status(400).json({
            success:false,
            message:"Invalid input in feilds"
        });
    }
    if(!employes.has(employeeId)){
        return res.status(404).json({
            success:false,
            message:"Emplyee doesn't exist"
        });
    }
    if(days<1){
        return res.status(404).json({
            success:false,
            message:"Days Specified are less than 1"
        });
    }
    const leave={
        leaveId:"lv-1",
        employeeId:employeeId,
        days:days,
        status:"PENDING"
    };
    leaves.set(leave.leaveId,leave);
    return res.status(200).json({
        success:true,
        message:"Leave Created Manager Contacts you",
        leave
    });
};  


export const LeaveApproval = async(req,res)=>{
    const {leaveId}=req.params;
    if(leaveId===undefined){
        return res.status(400).json({
            success:false,
            message:"leaveId is not defiend"
        });
    }
    if(typeof leaveId!=="string"){
        return res.status(400).json({
            success:false,
            message:"leaveId is invalid"
        });
    }
    if(!leaves.has(leaveId)){
        return res.status(404).json({
            success:false,
            message:"leaveId is not present"
        });
    }
    const employeeId=leaves.get(leaveId).employeeId;
    let daysLeft=employes.get(employeeId).daysLeft;
    let daysRequested=leaves.get(leaveId).days;
    if(daysLeft<daysRequested){
        return res.status(419).json({
            sucess:"false",
            message:"Number of days Requested in higher comapred to days left"
        });
    }
    daysLeft=daysLeft-daysRequested;
    const emp=employes.get(employeeId);
    emp.daysLeft=daysLeft;
    employes.set(employeeId,emp);
    const lea=leaves.get(leaveId);
    lea.status="APPROVED"
    leaves.set(leaveId,lea);
    return res.status(201).json({
        success:true,
        message:"Approved",
        leavedId:leaveId,
        status:"Approved",
        daysLeft:daysLeft
    });
}


//i would have to add loggers for validations conditions i would use logger.warn() and for success reponses i would keep logger.info();
//i have not considered any db failueres in my edge case handling 
//i can you a transaction here but not implemented here  