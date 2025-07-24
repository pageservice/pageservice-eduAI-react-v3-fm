// server/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;