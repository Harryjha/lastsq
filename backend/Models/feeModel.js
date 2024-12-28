import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  feeType: {
    type: String,
    enum: ['Tuition', 'Hostel', 'Transport', 'Other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Pending'
  },
  paymentHistory: [{
    amount: Number,
    paymentDate: Date,
    paymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'Cheque']
    },
    transactionId: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Fee', feeSchema); 