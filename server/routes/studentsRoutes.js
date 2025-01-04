const express = require("express");
const { getStudents, getFeesDetails, getResults } = require("../Controllers/studentController");
//router object
const router = express.Router();

//routes

//get all students list || GET
router.get('/getall', getStudents);

//get fees details || GET
router.get('/getfees', getFeesDetails);

//get results || GET
router.get('/getresults', getResults);

module.exports = router;
