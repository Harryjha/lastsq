import Student from '../Models/studentModel.js';
import Result from '../Models/resultModel.js';
import Fee from '../Models/feeModel.js';

export const studentController = {
  // Get student details by roll number
  getStudentDetails: async (req, res) => {
    try {
      const { rollNumber } = req.params;
      
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json({ student });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get results by roll number
  getStudentResults: async (req, res) => {
    try {
      const { rollNumber } = req.params;
      
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const results = await Result.find({ student: student._id })
        .sort({ semester: 1 }); // Sort by semester

      res.status(200).json({ results });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get fee details by roll number
  getStudentFees: async (req, res) => {
    try {
      const { rollNumber } = req.params;
      
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const fees = await Fee.find({ student: student._id });
      res.status(200).json({ fees });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get comprehensive student info (all details, results, and fees)
  getAllStudentInfo: async (req, res) => {
    try {
      const { rollNumber } = req.params;
      
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const results = await Result.find({ student: student._id }).sort({ semester: 1 });
      const fees = await Fee.find({ student: student._id });

      res.status(200).json({
        student,
        results,
        fees
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}; 