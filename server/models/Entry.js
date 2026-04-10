import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    notes: { type: String, default: '' },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Entry', entrySchema);
