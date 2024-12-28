import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subjects: [{
    name: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      required: true
    }
  }],
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  result: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Result', resultSchema); 