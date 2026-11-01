
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { ApiError } from "../utiles/ApiError.js";

dotenv.config();

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

const createRazorPayOrder = asyncHandler(async (req, res) => {
  // Check whether Razorpay is configured
  if (!razorpay) {
    throw new ApiError(503, "Payment service is not configured");
  }

  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay needs amount in paise
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    throw new ApiError(505, "Razorpay order failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Payment successfull", order));
});

export { createRazorPayOrder };
