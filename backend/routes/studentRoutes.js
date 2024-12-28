import express from 'express';
import { studentController } from '../controllers/studentController.js';

const router = express.Router();

// Route for getting student details
router.get('/student/:rollNumber', studentController.getStudentDetails);

// Route for getting student results
router.get('/student/:rollNumber/results', studentController.getStudentResults);

// Route for getting student fees
router.get('/student/:rollNumber/fees', studentController.getStudentFees);

// Route for getting all student information
router.get('/student/:rollNumber/all', studentController.getAllStudentInfo);

export default router; 