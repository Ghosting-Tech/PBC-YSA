import mongoose, { Schema } from "mongoose";

const customizeSchema = new Schema({
  heading1: { type: String },
  heading2: { type: String },
  heading3: { type: String },
  heading4: { type: String },
  images: [
    {
      url: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  videos: [
    {
      url: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
});

const Customize =
  mongoose.models.Customize || mongoose.model("Customize", customizeSchema);
export default Customize;
