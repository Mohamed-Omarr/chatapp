'use server'
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { UpdatePasswordSchema, UpdateUserEmailSchema, UpdateUserImageSchema, UpdateUserNameSchema } from "@/lib/validation/profile";

export interface FormActionResult {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// ---------------- Update User Password ----------------
export async function updateUserPassword(
  state: FormActionResult | undefined,
  formData: FormData
): Promise<FormActionResult> {

  const currentPassword = String(formData.get("currentPassword")).trim();
  const newPassword = String(formData.get("newPassword")).trim();
  const confirmPassword = String(formData.get("confirmNewPassword")).trim();

  
  const validated = UpdatePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });

  if (!validated.success) {
    return {
      success:false,
      errors: validated.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { currentPassword: curr, newPassword: newP } = validated.data;

  const supabase = await supabaseServer();

  // Reauthenticate user
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user?.email) {
    return { 
    success:false,
    errors: { 
      auth: ["User session not found. Please log in again."] }, 
      message: "Reauthentication failed." 
    };
  }

  const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: curr });
  if (reauthError) {
    return { 
      success:false,
      errors: { currentPassword: ["Current password is incorrect."] }, message: "Validation failed." };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({ password: newP });
  if (updateError) {
    return {
      success:false, 
      errors: { supabase: [updateError.message] }, message: "Password update failed." };
  }

  return { 
    success:true,
    message: "Password updated successfully!" };
}

// ---------------- Update User Image ----------------
type UpdateUserImageResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  imageUrl?: string
}

export async function updateUserImage(
  file: File
): Promise<UpdateUserImageResult> {
  const supabase = await supabaseServer();

  // Reauthenticate user
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user?.id) {
    return {
      success: false,
      errors: { auth: ["User session not found. Please log in again."] },
      message: "Reauthentication failed.",
    };
  }

  // Construct unique path for file
  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return {
      success: false,
      errors: { storage: [uploadError.message] },
      message: "Failed to upload image to storage.",
    };
  }

  // Generate signed URL for private bucket
  const { data, error: signedUrlError } = await supabase
    .storage
    .from("avatars")
    .createSignedUrl(filePath, 60 * 60); // 1 hour

  if (signedUrlError || !data?.signedUrl) {
    return {
      success: false,
      errors: { storage: [signedUrlError?.message || "Failed to create signed URL"] },
      message: "Failed to generate signed URL for avatar.",
    };
  }

  const signedUrl = data.signedUrl;

  // Save URL in profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: signedUrl })
    .eq("id", user.id);

  if (updateError) {
    return {
      success: false,
      errors: { profile: [updateError.message] },
      message: "Failed to update profile image.",
    };
  }

  return {
    success: true,
    message: "Profile image updated successfully!",
    imageUrl: signedUrl,
  };
}


// ---------------- Update User Email ----------------
export async function updateUserEmail(
  state: FormActionResult | undefined,
  formData: FormData
): Promise<FormActionResult> {
  const newEmail = String(formData.get("email")).trim();
  const supabase = await supabaseServer();


  // ✅ Validate
  const validated = UpdateUserEmailSchema.safeParse({ newEmail });
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Validation failed for email update.",
    };
  }
  
  // ✅ Update
  const { error } = await supabase.auth.updateUser({ email: newEmail  });
  
  if (error) {
    return {
      success: false,
      errors: { auth: [error.message] },
      message: "Failed to update email.",
    };
  }

  return { success: true, message: "Email updated successfully!" };
}


// ---------------- Update User Name ----------------
export async function updateUserName(
  state: FormActionResult | undefined,
  formData: FormData,
): Promise<FormActionResult> {
  const newName = String(formData.get("name"));

   const supabase = await supabaseServer();

  const validated = UpdateUserNameSchema.safeParse({  newName });
  if (!validated.success) {
    return { 
      success:false,
      errors: validated.error.flatten().fieldErrors, message: "Validation failed for name update." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: newName })
    .eq("id","bd31d520-4694-43a1-a006-d3058a3f7eba");
  

  if (error) {
    return { 
      success:false,
      errors: { profile: [error.message] }, message: "Failed to update name." };
  }

  return { 
    success:true,
    message: "Name updated successfully!" };
}
