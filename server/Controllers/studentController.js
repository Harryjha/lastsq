const db = require("../config/db");

const getStudents =async(req,res)=>{
    const { Rollno, program } = req.query;
    
    // Add logging to debug
    console.log('Received request with:', { Rollno, program });

    try{
        // First, let's check if we're getting data from the query
        const data = await db.query(
            "SELECT * FROM students WHERE roll_number = ? AND program = ?", 
            [Rollno, program]
        );
        
        // Log the query results
        console.log('Query results:', data[0]);

        // Change the condition to check data[0]
        if(!data[0] || data[0].length === 0){
            // Check if the roll number exists with a different program
            const studentCheck = await db.query(
                "SELECT program FROM students WHERE roll_number = ?",
                [Rollno]
            );

            if(studentCheck[0] && studentCheck[0].length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `This roll number belongs to ${studentCheck[0][0].program} program, not ${program}`,
                });
            }

            return res.status(400).json({
                success: false,
                message: "No student found with given roll number",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            totalstudents: data[0].length,
            data: data[0],
        }); 
    }catch(error){
        console.log('Database error:', error);
        res.status(500).json({
            success: false,
            message: "Error in getStudents",
            error: error.message
        })
    }
}; 
// Controller to get student fees details
const getFeesDetails = async (req, res) => {
    const { Rollno, program } = req.query;
  
    try {
        const data = await db.query(
            `SELECT f.* 
             FROM fees f 
             JOIN students s ON f.roll_number = s.roll_number 
             WHERE f.roll_number = ? AND s.program = ?`, 
            [Rollno, program]
        );

        if (!data[0] || data[0].length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fees data found",
            });
        }

        // Convert the values to numbers to ensure they're numeric
        const feeData = {
            dueAmount: Number(data[0][0].due_amount),
            paidAmount: Number(data[0][0].paid_amount),
            balance: Number(data[0][0].due_amount) - Number(data[0][0].paid_amount),
            status: Number(data[0][0].paid_amount) >= Number(data[0][0].due_amount) ? 'Fully Paid' : 'Pending'
        };

        res.status(200).json({
            success: true,
            message: "Fees data fetched successfully",
            data: feeData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getFeesDetails",
            error,
        });
    }
};
  
  // Controller to get student results details
  const getResults = async (req, res) => {
    const { Rollno, program } = req.query;
  
    try {
        const data = await db.query(
            "SELECT r.* FROM results r JOIN students s ON r.roll_number = s.roll_number WHERE r.roll_number = ? AND s.program = ?",
            [Rollno, program]
        );

        if (!data[0] || data[0].length === 0) {
            return res.status(400).json({
                success: false,
                message: "No results data found",
            });
        }

        // Format the results data
        const formattedResults = data[0].map(result => ({
            semester: result.semester,
            totalMarks: result.total_marks,
            percentage: result.percentage,
            result: result.result
        }));

        res.status(200).json({
            success: true,
            message: "Results data fetched successfully",
            totalRecords: formattedResults.length,
            data: formattedResults
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getResults",
            error,
        });
    }
  };



module.exports = {
    getStudents,
    getFeesDetails,
    getResults
}