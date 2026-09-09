import slugify from "slugify";
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "please enter your property name"]
    },
    description: {
        type: String,
        required: [true, "please add information your property"]
    },
    extraInfo: {
        type: String,
        default: "good services available"
    },
    propertyType: {
        type: String,
        enum: ["House", "Flat", "Guest House", "Hotel"],
        default: "House"
    },
    roomType: {
        type: String,
        enum: ["Anytype", "Room", "Entire Room"],
        default: "Anytype"
    },
    maximumGuest: {
        type: Number,
        required: [true, "please give the maximum no of Guest"]
    },
    amenities: [
        {
            name: {
                type: String,
                required: true,
                enum: [
                    "Wifi",
                    "Kitchen",
                    "Ac",
                    "TV",
                    "Washing Machine",
                    "Pool",
                    "Free Parking"
                ]
            },
            icon: {
                type: String,
                required: true
            }
        }
    ],
    images: {
        type: [
            {
                public_id: {
                    type: String
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        validate: {
            validator: function (arr) {
                return arr.lenght >= 6;
            },
            message: "The images must be atleast 6 images"
        }
    },
    price: {
        type: Number,
        required: [true, "please enter price per night value"],
        default: 1000
    },
    address: {
        area: String,
        city: String,
        state: String,
        pincode: Number
    },

    currentBookings: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    slug: String,
    checkInTime: { type: String, default: "11:00" },
    checkOutTime: { type: String, default: "13:00" },
})

propertySchema.pre("save", function (next) {
    this.slug = slugify(this.propertyName, { lower: true });
    next();
})

propertySchema.pre("save", function (next) {
    this.address.city = this.address.city.toLowerCase().replaceAll(" ", "")
    next();
})

const Property = mongoose.model.Property || mongoose.model("Property", propertySchema);

export { Property };