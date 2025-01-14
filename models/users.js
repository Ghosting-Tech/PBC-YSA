import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: {
        url: String,
        name: String,
      },
      default: {
        url: "",
        name: "",
      },
    },
    id1: {
      name: {
        type: String,
      },
      image: {
        url: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    },
    id2: {
      name: {
        type: String,
      },
      image: {
        url: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    },
    degree: {
      name: {
        type: String,
      },
      image: {
        url: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    },
    cv: {
      url: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
    },
    profession: {
      type: String,
      default: "",
    },
    certificate: {
      url: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
    },
    enrollno: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
    },
    religion: {
      type: String,
    },
    locations: {
      type: [],
      default: [],
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "service-provider"],
    },
    password: {
      type: String,
      required: true,
    },
    services: {
      type: [{ type: Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    reviews: {
      type: [], // Assuming these are references to other documents
      default: [],
    },
    bookings: {
      type: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
      default: [], // Default value as an empty array
    },
    tickets: {
      type: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
      default: [], // Default value as an empty array
    },
    payments: {
      type: [], // Assuming these are references to other documents
      default: [],
    },
    messages: {
      type: [], // Assuming these are references to other documents
    },
    lastVisit: {
      type: Date,
      default: null,
    },
    loginHistory: {
      type: [
        {
          eventType: { type: String, enum: ["login", "logout"] }, // Event can be either login or logout
          timestamp: { type: Date, default: Date.now }, // Timestamp of the event
        },
      ],
      default: [], // Default to an empty array
    },
    notificationToken: {
      type: String,
    },
    mobileNotificationToken: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(12, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
