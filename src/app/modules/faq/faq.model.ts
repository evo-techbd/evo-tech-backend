import { Schema, model } from "mongoose";
import { IFaq } from "./faq.interface";

const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ isActive: 1, order: 1 });

export const Faq = model<IFaq>("Faq", faqSchema);
