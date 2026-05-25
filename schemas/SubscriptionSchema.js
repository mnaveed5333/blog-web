import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  plan: { type: String, default: "premium" },
  status: { type: String, enum: ["active", "inactive", "canceled", "past_due"], default: "inactive" },
  currentPeriodEnd: { type: Date },
}, { timestamps: true })

export default SubscriptionSchema