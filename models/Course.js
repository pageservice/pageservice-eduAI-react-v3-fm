// server/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  provider: { type: String, required: true },
  duration: { type: String },
  price: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  students: { type: Number, default: 0 },
  description: { type: String }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;