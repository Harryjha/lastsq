const db = require("../config/db");

const getStudents =async(req,res)=>{
    const Rollno = req.query.Rollno;

    try{
        const data = await db.query("SELECT * FROM students WHERE roll_number = ?", [Rollno]);
        if(!data){
            return res.status(400).json({
                success: false,
                message: "No data found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            totalstudents:data[0].length,
            data:data[0],
        }); 
    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in getStudents",
            error
        })
    }
}; 
// Controller to get student fees details
const getFeesDetails = async (req, res) => {
    const Rollno = req.query.Rollno;
  
    try {
      const data = await db.query("SELECT * FROM fees WHERE roll_number = ?", [Rollno]);
      if (!data[0] || data[0].length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fees data found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Fees data fetched successfully",
        totalRecords: data[0].length,
        data: data[0],
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
    const Rollno = req.query.Rollno;
  
    try {
      const data = await db.query("SELECT * FROM results WHERE roll_number = ?", [Rollno]);
      if (!data[0] || data[0].length === 0) {
        return res.status(400).json({
          success: false,
          message: "No results data found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Results data fetched successfully",
        totalRecords: data[0].length,
        data: data[0],
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