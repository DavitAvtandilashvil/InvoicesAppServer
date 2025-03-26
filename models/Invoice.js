const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const invoiceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4, // Generate a unique ID for each invoice
    },
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `INV${Math.floor(1000 + Math.random() * 9000)}`;
      },
    },

    paymentStatus: { type: String, required: true },
    billFrom: {
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      postCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    billTo: {
      clientName: { type: String, required: true },
      clientEmail: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      postCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    invoiceDate: { type: String, required: true },
    paymentTerms: { type: String, required: true },
    projectDescription: { type: String, required: true },
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
