import { z } from "zod";

// Strong password regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(
        strongPasswordRegex,
        "Password must include uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z.string().min(8, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });


export const UpdateUserImageSchema = z.object({
  imageUrl: z
    .url({ message: "Invalid URL" })
    .refine((url) =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
    , { message: "URL must be an image (jpg, jpeg, png, gif, webp, svg)" }),
});


export const UpdateUserNameSchema = z.object({
  newName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

export const UpdateUserEmailSchema = z.object({
    newEmail: z.email({ message: "Invalid email address" }),
});