import mongoose, { Schema } from "mongoose";
import User from "./users";
import Counter from "./counter";

const bookingSchema = new Schema(
  {
    bookingId: { type: String, unique: true },
    cartItems: {
      type: [],
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Payment failed!",
    },
    paymentStatus: {
      is_paid: {
        type: Boolean,
        required: true,
        default: false,
      },
      paid_full: {
        type: Boolean,
        required: true,
        default: false,
      },
      total_amount: {
        type: Number,
        required: true,
      },
      paid_amount: {
        type: Number,
        required: true,
        default: 0, // Start with 0, increment as payments are made
      },
      remaining_amount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    address: {
      type: String,
    },
    profileImage: {
      type: Object,
    },
    feedback: {
      type: String,
    },
    sendedToServiceProvider: {
      type: Boolean,
      default: false,
    },
    acceptedByServiceProvider: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    paymentMethod: { type: String },
    verificationImage: {
      type: Object,
      default: {
        url: "",
        name: "",
      },
    },
    availableServiceProviders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invoices: {
      type: {
        title: String,
        date: String,
        time: String,
        paymentMethod: { type: String },
        transactionId: { type: String },
        paid: { type: Boolean },
        responded: {
          type: Boolean,
          required: true,
          default: false,
        },
        status: { type: String, default: "Not Accepted Yet!", required: true },
        invoiceAccepted: {
          type: Boolean,
          default: false,
        },
        items: [
          {
            description: String,
            quantity: String,
            unitPrice: String,
            amount: String,
          },
        ],
        total: { type: Number, required: true, default: 0 },
      },
    },
    assignedServiceProviders: {
      type: Object,
    },
    location: {
      type: Object,
    },
    noServiceProviderAvailable: { type: Boolean, default: false },
    canceledByCustomer: { type: String, default: "" },
    serviceCompletedOtp: { type: String },
    transactionId: { type: String },
    expired: { type: Boolean, default: false },
    patientCondition: { type: String },
    prescription: { type: Object },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    access: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "bookingId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.bookingId = counter.value;
  }
  next();
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
