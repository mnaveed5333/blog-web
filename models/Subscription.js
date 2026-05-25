import mongoose from "mongoose"
import SubscriptionSchema from "@/schemas/SubscriptionSchema"

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema)
export default Subscription