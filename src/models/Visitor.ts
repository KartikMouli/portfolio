import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema); 