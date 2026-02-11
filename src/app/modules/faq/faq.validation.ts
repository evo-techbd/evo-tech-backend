import { z } from "zod";

const createFaqValidationSchema = z.object({
  body: z.object({
    question: z
      .string({
        required_error: "Question is required",
      })
      .min(5, "Question must be at least 5 characters long"),
    answer: z
      .string({
        required_error: "Answer is required",
      })
      .min(5, "Answer must be at least 5 characters long"),
    order: z.number().int().min(0).optional(),
  }),
});

const updateFaqValidationSchema = z.object({
  body: z.object({
    question: z
      .string()
      .min(5, "Question must be at least 5 characters long")
      .optional(),
    answer: z
      .string()
      .min(5, "Answer must be at least 5 characters long")
      .optional(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const FaqValidation = {
  createFaqValidationSchema,
  updateFaqValidationSchema,
};
