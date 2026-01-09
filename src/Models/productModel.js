import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please enter product description"],
    },
    brand: {
      type: String,
      required: [true, "Please enter product brand"],
    },
    image: {
      type: [String],
      required: [true, "Please Provide Product Image"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please enter product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },

        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.numReviews = this.reviews.length;

  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );
    this.rating = totalRating / this.reviews.length;
  } else {
    this.rating = 0;
  }

  next();
});

const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);

export default Product;
