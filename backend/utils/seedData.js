import mongoose from 'mongoose';
import Student from '../Models/studentModel.js';
import Result from '../Models/resultModel.js';
import Fee from '../Models/feeModel.js';
import dotenv from 'dotenv';
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dummy Students Data
const students = [
  {
    name: "John Doe",
    dateOfBirth: new Date('2000-05-15'),
    gender: "Male",
    branch: "Computer Science",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "CS2020001"
  },
  {
    name: "Jane Smith",
    dateOfBirth: new Date('2001-03-21'),
    gender: "Female",
    branch: "Electronics",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "EC2020002"
  },
  {
    name: "Mike Johnson",
    dateOfBirth: new Date('2000-08-10'),
    gender: "Male",
    branch: "Mechanical",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "ME2020003"
  },
  {
    name: "Sarah Williams",
    dateOfBirth: new Date('2001-01-30'),
    gender: "Female",
    branch: "Computer Science",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "CS2020004"
  },
  {
    name: "Robert Brown",
    dateOfBirth: new Date('2000-11-25'),
    gender: "Male",
    branch: "Civil",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "CV2020005"
  },
  {
    name: "Emily Davis",
    dateOfBirth: new Date('2001-04-12'),
    gender: "Female",
    branch: "Electronics",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "EC2020006"
  },
  {
    name: "David Wilson",
    dateOfBirth: new Date('2000-07-19'),
    gender: "Male",
    branch: "Mechanical",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "ME2020007"
  },
  {
    name: "Lisa Anderson",
    dateOfBirth: new Date('2001-02-28'),
    gender: "Female",
    branch: "Computer Science",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "CS2020008"
  },
  {
    name: "James Taylor",
    dateOfBirth: new Date('2000-09-14'),
    gender: "Male",
    branch: "Civil",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "CV2020009"
  },
  {
    name: "Emma Martinez",
    dateOfBirth: new Date('2001-06-05'),
    gender: "Female",
    branch: "Electronics",
    yearOfAdmission: "2020",
    currentYear: "4",
    rollNumber: "EC2020010"
  }
];

// Function to calculate grade based on marks
const calculateGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
};

// Function to create results for a student
const createResult = (studentId) => {
  // Generate random marks for each subject
  const subjects = [
    { name: "Mathematics", marks: Math.floor(Math.random() * 40) + 60 },
    { name: "Physics", marks: Math.floor(Math.random() * 40) + 60 },
    { name: "Chemistry", marks: Math.floor(Math.random() * 40) + 60 }
  ];
  
  // Add grades based on marks
  subjects.forEach(subject => subject.grade = calculateGrade(subject.marks));
  
  // Calculate total marks and percentage
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const percentage = (totalMarks / (subjects.length * 100)) * 100;

  return {
    student: studentId,
    semester: Math.floor(Math.random() * 8) + 1, // Random semester 1-8
    subjects,
    totalMarks,
    percentage: Number(percentage.toFixed(2)),
    result: percentage >= 40 ? "Pass" : "Fail"
  };
};

// Function to create fee details for a student
const createFee = (studentId) => {
  const totalAmount = 50000 + Math.floor(Math.random() * 20000); // Random total between 50000-70000
  const paidAmount = Math.floor(Math.random() * totalAmount);
  
  return {
    student: studentId,
    academicYear: "2023-24",
    feeType: "Tuition",
    amount: totalAmount,
    dueDate: new Date('2024-06-30'),
    paymentStatus: paidAmount >= totalAmount ? "Paid" : "Pending",
    paymentHistory: paidAmount > 0 ? [{
      amount: paidAmount,
      paymentDate: new Date('2023-12-15'),
      paymentMode: ["Online", "Cash", "Cheque"][Math.floor(Math.random() * 3)],
      transactionId: "TXN" + Math.random().toString(36).substr(2, 9)
    }] : []
  };
};

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await Student.deleteMany({});
    await Result.deleteMany({});
    await Fee.deleteMany({});

    // Insert students
    const createdStudents = await Student.insertMany(students);
    console.log('Students created successfully');

    // Create results and fees for each student
    for (const student of createdStudents) {
      await Result.create(createResult(student._id));
      await Fee.create(createFee(student._id));
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 
export default seedDatabase; 