// routes/invoices.js
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");

// routes/invoices.js
router.get("/", authMiddleware, async (req, res) => {
  try {
    let { paymentStatus } = req.query;

    // Always filter by user ID
    let filter = { userId: req.user.id };

    if (paymentStatus) {
      // Ensure paymentStatus is always an array
      const statusArray = Array.isArray(paymentStatus)
        ? paymentStatus
        : [paymentStatus];

      filter.paymentStatus = { $in: statusArray }; // Use MongoDB $in
    }

    const invoices = await Invoice.find(filter);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
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
    res.status(201).json({ message: "Invoice created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({ id, userId: req.user.id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findOneAndDelete({
      id,
      userId: req.user.id, // Ensure the user owns the invoice
    });

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
