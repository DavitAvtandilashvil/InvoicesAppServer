const express = require("express");
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get user invoices
router.get("/", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create invoice
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newInvoice = new Invoice({
      userId: req.user.id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice" });
  }
});

module.exports = router;
