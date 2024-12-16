import mongoose, { Schema } from "mongoose";

const ticket = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    issue: {
      type: String,
      required: [true, "Issue is required"],
    },
    from: {
      type: String,
      required: [true, "Source is required"],
      enum: {
        values: ["user", "provider"],
        message: "Source must be either 'user' or 'provider'",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["resolved", "unresolved"],
        message: "Status must be either 'resolved' or 'unresolved'",
      },
      default: "unresolved",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["refund", "other"],
        message: "Category must be either 'refund' or 'other'",
      },
    },
    file: {
      type: {
        url: {
          type: String,
          required: [true, "File URL is required"],
        },
        name: {
          type: String,
          required: [true, "File name is required"],
        },
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticket);

export default Ticket;
