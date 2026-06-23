import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";
import auth from "../middlewares/auth.js";
import User from "../models/user.model.js";

const router = express.Router();

const getCreditPriceInr = () => Number(process.env.CREDIT_PRICE_INR || 100);

const getRazorpay = () => {
  if (!process.env.RZP_ID || !process.env.RZP_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RZP_ID,
    key_secret: process.env.RZP_SECRET,
  });
};

const getPaymentConfigError = () => {
  if (!getRazorpay()) {
    return "Razorpay is not configured. Add RZP_ID and RZP_SECRET to backend/.env.";
  }
  const creditPriceInr = getCreditPriceInr();
  if (!Number.isFinite(creditPriceInr) || creditPriceInr <= 0) {
    return "Invalid CREDIT_PRICE_INR configuration.";
  }
  return "";
};

router.post("/create-order", auth, async (req, res) => {
  try {
    const configError = getPaymentConfigError();
    if (configError) {
      return res.status(500).json({ message: configError });
    }
    const razorpay = getRazorpay();
    const creditPriceInr = getCreditPriceInr();

    const credits = Number(req.body.credits);
    if (!Number.isInteger(credits) || credits <= 0) {
      return res.status(400).json({ message: "Invalid credits amount" });
    }

    const amountInr = credits * creditPriceInr;
    const amountPaise = amountInr * 100;
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `credits_${req.userId}_${Date.now()}`.slice(0, 40),
      notes: {
        userId: req.userId,
        credits: String(credits),
      },
    });

    return res.json({
      keyId: process.env.RZP_ID,
      orderId: order.id,
      amount: order.amount,
      amountInr,
      currency: order.currency,
      credits,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.message || "Could not create Razorpay order" });
  }
});

router.post("/verify", auth, async (req, res) => {
  try {
    const configError = getPaymentConfigError();
    if (configError) {
      return res.status(500).json({ message: configError });
    }
    const razorpay = getRazorpay();

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res
        .status(400)
        .json({ message: "Missing Razorpay payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await razorpay.orders.fetch(orderId);
    if (order.notes?.userId !== req.userId) {
      return res
        .status(400)
        .json({ message: "Payment order does not belong to this user" });
    }

    const credits = Number(order.notes?.credits);
    if (!Number.isInteger(credits) || credits <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid credits in payment order" });
    }

    const amountInr = Number(order.amount) / 100;
    const existingPurchase = await User.findOne({
      _id: req.userId,
      "creditPurchases.paymentId": paymentId,
    }).select("credits");

    if (existingPurchase) {
      console.log(
        `[Payment] Payment already verified for user ${req.userId}, payment ${paymentId}`,
      );
      return res.json({
        message: "Payment already verified.",
        credits: existingPurchase.credits,
        purchasedCredits: credits,
        amountInr,
        paymentId,
      });
    }

    console.log(
      `[Payment] Processing new payment for user ${req.userId}, adding ${credits} credits`,
    );

    // Get user's current credits before update
    const userBefore = await User.findById(req.userId).select("credits");
    const creditsBefore = userBefore?.credits ?? 0;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: { credits },
        $push: {
          creditPurchases: {
            credits,
            amountInr,
            paymentId,
            razorpayOrderId: orderId,
            status: "success",
          },
        },
      },
      { new: true },
    ).select("-password");

    if (!user) {
      console.error(
        `[Payment] User not found after update for userId ${req.userId}`,
      );
      return res.status(404).json({ message: "User not found" });
    }

    const expectedCredits = creditsBefore + credits;
    if (user.credits !== expectedCredits) {
      console.warn(
        `[Payment] Credits mismatch! Expected: ${expectedCredits}, Got: ${user.credits}`,
      );
    }

    console.log(
      `[Payment] Payment successful for user ${req.userId}, credits: ${creditsBefore} -> ${user.credits}`,
    );

    return res.json({
      message: "Payment successful. Credits added.",
      credits: user.credits,
      purchasedCredits: credits,
      amountInr,
      paymentId,
    });
  } catch (err) {
    console.error(`[Payment] Error in payment verification:`, err);
    return res
      .status(500)
      .json({ message: err.message || "Payment verification failed" });
  }
});

export default router;
