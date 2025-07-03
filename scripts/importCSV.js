//server\scripts\importCSV.js
import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const results = [];

fs.createReadStream('courses.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    try {
      await Course.insertMany(results);
      console.log('✅ 데이터 삽입 완료');
      process.exit();
    } catch (error) {
      console.error('❌ 삽입 오류:', error);
      process.exit(1);
    }
  });