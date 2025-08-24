"use client"
import type React from "react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, Loader2, User, Lock, ChevronDown, ChevronRight, Edit, X, Upload } from "lucide-react"
import { updateUserEmail, updateUserImage, updateUserName, updateUserPassword } from "../../../../actions/profile"
import { UpdatePasswordSchema, UpdateUserEmailSchema, UpdateUserNameSchema } from "@/lib/validation/profile"
import { toast } from "react-toastify"


type NameFormData = z.infer<typeof UpdateUserNameSchema>
type EmailFormData = z.infer<typeof UpdateUserEmailSchema>
type PasswordFormData = z.infer<typeof UpdatePasswordSchema>

// Mock user data - in a real app, this would come from your auth system

type UserData = {
  id:number,
  name: string,
  email: string,
  avatar: string | undefined,
}
const mockUser:UserData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=120&width=120",
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)

  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(UpdateUserNameSchema),
    defaultValues: {
      newName: user.name,
    },
  })

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(UpdateUserEmailSchema),
    defaultValues: {
      newEmail: user.email,
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Tab states
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  // Edit states for personal information
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

  // Loading states
  const [isNameLoading, setIsNameLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Image size should be less than 5MB.");
    return;
  }

  try {
    setIsUploadingImage(true);

    // Preview (local only)
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    const result = await updateUserImage(file);

    if (result.success) {
      setUser({
        ...user,
        avatar: result.imageUrl, // ✅ real Supabase storage URL
      });
      alert(result.message);
    } else {
      console.log(result.errors);
      alert(result.message);
      setPreviewImage(null);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image. Please try again.");
    setPreviewImage(null);
  } finally {
    setIsUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};


  const handleSaveName = async (data: NameFormData) => {
    try {
      setIsNameLoading(true)
      const formData = new FormData()
      formData.append("name", data.newName)

      const result = await updateUserName(undefined, formData)

      if (result.success) {
        setIsEditingName(false)
        setUser({ ...user, name: data.newName })
        nameForm.reset({ newName: data.newName })
      } else if (result?.errors) {
        // Set server errors on the form
        Object.entries(result.errors).forEach(([field, messages]) => {
          nameForm.setError(field as keyof NameFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      }
    } catch (error) {
      console.error("Error updating name:", error)
      toast.error("Failed to update name")
      nameForm.setError("newName", { message: "Failed to update name" })
    } finally {
      setIsNameLoading(false)
    }
  }

  const handleSaveEmail = async (data: EmailFormData) => {
    try {
      setIsEmailLoading(true)
      const formData = new FormData()
      formData.append("email", data.newEmail)

      const result = await updateUserEmail(undefined, formData)

      if (result?.success) {
        setUser({ ...user, email: data.newEmail })
        setIsEditingEmail(false)
        emailForm.reset({ newEmail: data.newEmail })
      } else if (result?.errors) {
        // Set server errors on the form
        Object.entries(result.errors).forEach(([field, messages]) => {
          emailForm.setError(field as keyof EmailFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      }
    } catch (error) {
      console.error("Error updating email:", error)
      emailForm.setError("newEmail", { message: "Failed to update email" })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      setIsPasswordLoading(true)
      const formData = new FormData()
      formData.append("currentPassword", data.currentPassword)
      formData.append("newPassword", data.newPassword)
      formData.append("confirmNewPassword", data.confirmPassword)

      const result = await updateUserPassword(undefined, formData)

      if (result?.success) {
        passwordForm.reset()
        setIsPasswordOpen(false)
      } else if (result?.errors) {
        // Set server errors on the form
        Object.entries(result.errors).forEach(([field, messages]) => {
          passwordForm.setError(field as keyof PasswordFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
      }
    } catch (error) {
      console.error("Error updating password:", error)
      passwordForm.setError("currentPassword", { message: "Failed to update password" })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleCancelNameEdit = () => {
    nameForm.reset({ newName: user.name })
    setIsEditingName(false)
  }

  const handleCancelEmailEdit = () => {
    emailForm.reset({ newEmail: user.email })
    setIsEditingEmail(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage || user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                onClick={handleImageUpload}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={handleImageUpload}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Picture
                    </>
                  )}
                </Button>
                {previewImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewImage(null)
                      setUser({ ...user, avatar: mockUser.avatar })
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Tab */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            {isPersonalInfoOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>

        {isPersonalInfoOpen && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />

            <div className="space-y-6">
              {/* Name Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  {!isEditingName && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                {!isEditingName ? (
                  <p className="text-sm font-medium">{user.name}</p>
                ) : (
                  <form onSubmit={nameForm.handleSubmit(handleSaveName)} className="space-y-2">
                    <Input {...nameForm.register("newName")} placeholder="Enter your full name" />
                    {nameForm.formState.errors.newName && (
                      <p className="text-sm text-destructive">{nameForm.formState.errors.newName.message}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button type="submit" size="sm" disabled={isNameLoading || !nameForm.formState.isValid}>
                        {isNameLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelNameEdit}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              <Separator />

              {/* Email Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                  {!isEditingEmail && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingEmail(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                {!isEditingEmail ? (
                  <p className="text-sm font-medium">{user.email}</p>
                ) : (
                  <form onSubmit={emailForm.handleSubmit(handleSaveEmail)} className="space-y-2">
                    <Input type="email" {...emailForm.register("newEmail")} placeholder="Enter your email address" />
                    {emailForm.formState.errors.newEmail && (
                      <p className="text-sm text-destructive">{emailForm.formState.errors.newEmail.message}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button type="submit" size="sm" disabled={isEmailLoading || !emailForm.formState.isValid}>
                        {isEmailLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelEmailEdit}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Change Password Tab */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Change Password</CardTitle>
            </div>
            {isPasswordOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </CardHeader>

        {isPasswordOpen && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />

            <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  placeholder="Enter your current password"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    placeholder="Enter new password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordLoading || !passwordForm.formState.isValid}>
                  {isPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Account Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
