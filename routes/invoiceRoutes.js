// routes/invoices.js
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");

// routes/invoices.js
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get invoices for the authenticated user
    const invoices = await Invoice.find({ userId: req.user.id });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      clientName,
      date,
      price,
      paymentStatus,
      billFrom,
      billTo,
      invoiceDate,
      paymentTerms,
      projectDescription,
      items,
    } = req.body;

    // Ensure the userId is provided
    const newInvoice = new Invoice({
      clientName,
      date,
      price,
      paymentStatus,
      billFrom,
      billTo,
      invoiceDate,
      paymentTerms,
      projectDescription,
      items,
      userId: req.user.id, // Use authenticated user ID
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
