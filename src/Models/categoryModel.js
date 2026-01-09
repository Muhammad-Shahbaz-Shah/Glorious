import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category name"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Please Provide Category Image"],
    },
    description: {
      type: String,
      required: [true, "Please enter category description"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    company: {
      type:[String],
      required:[true,"Please provide company name"]
    },
  },
  { timestamps: true }
);
const Category =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);

export default Category;
