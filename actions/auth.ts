'use server'
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"
import { LoginFormSchema, RegisterFormSchema } from "@/lib/validation/auth"

type RegisterFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        confirmPassword?: string[] 
        supabaseAuthError?: string[]
        supabaseProfileError?: string[]
      }
      message?: string
    }
  | undefined

type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
        supabaseAuthError?: string[]
      }
      message?: string
      accessToken?: string
    }
  | undefined


// ---------------------- REGISTER ----------------------
export async function register(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  
  const validatedFields = RegisterFormSchema.safeParse({
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim().toLowerCase(),
    password: String(formData.get("password")).trim(),
    confirmPassword: String(formData.get("confirmPassword")).trim(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { name, email, password } = validatedFields.data;
  const supabase = await supabaseServer();

  // Sign up
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return {
      errors: { supabaseAuthError: [error.message] },
      message: error.message,
    };
  }

  // Create profile
  if (data.user) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, username: name, email: data.user.email }]);

    if (insertError) {
      return {
        errors: { supabaseProfileError: [insertError.message] },
        message: `Sign-up succeeded but profile creation failed: ${insertError.message}`,
      };
    }
  }


  return { message: "Successful sign up!" };
}


// ---------------------- LOGIN ----------------------
export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    }
  }

  const { email, password } = validatedFields.data
  const supabase = await supabaseServer()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    return {
      errors: { supabaseAuthError: [error.message] },
      message: error.status === 400
        ? "The email or password you entered is incorrect."
        : error.message,
    }
  }

  return {
    message: "Welcome back!",
    accessToken: data.session?.access_token,
  }
}

// ---------------------- LOGOUT ----------------------
export async function logout() {
  const supabase = await supabaseServer()

  const { error } = await  supabase.auth.signOut()

  if (error) throw new Error('Error signing out: ' + error.message)

  return 'User signed out successfully.'
}
