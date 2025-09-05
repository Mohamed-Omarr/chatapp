"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {  User, Lock, ChevronDown, ChevronRight, Edit } from "lucide-react";

import { updateUserEmail, updateUserName, updateUserPassword } from "../../../../actions/profile";
import { UpdatePasswordSchema, UpdateUserEmailSchema, UpdateUserNameSchema } from "@/lib/validation/profile";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/UserContext";
import { ProfileImageCard } from "@/components/profile/ProfileImageCard";

// --- Types ---
type NameFormData = z.infer<typeof UpdateUserNameSchema>;
type EmailFormData = z.infer<typeof UpdateUserEmailSchema>;
type PasswordFormData = z.infer<typeof UpdatePasswordSchema>;

// --- Profile Page ---
export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // --- Forms ---
  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(UpdateUserNameSchema),
    defaultValues: { newName: user?.username },
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(UpdateUserEmailSchema),
    defaultValues: { newEmail: user?.email },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!user) return <p>Failed to get user</p>;

  // --- Handlers ---
  const handleSaveName = async (data: NameFormData) => {
    try {
      setIsNameLoading(true);
      const formData = new FormData();
      formData.append("name", data.newName);
      const result = await updateUserName(undefined, formData);

      if (result.success) {
        setUser({ ...user, username: data.newName });
        setIsEditingName(false);
        nameForm.reset({ newName: data.newName });
        toast.success("Name updated successfully!");
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) =>
          nameForm.setError(field as keyof NameFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
      }
    } catch (err) {
      console.error(err);
      nameForm.setError("newName", { message: "Failed to update name" });
      toast.error("Failed to update name");
    } finally {
      setIsNameLoading(false);
    }
  };

  const handleSaveEmail = async (data: EmailFormData) => {
    try {
      setIsEmailLoading(true);
      const formData = new FormData();
      formData.append("email", data.newEmail);
      const result = await updateUserEmail(undefined, formData);

      if (result.success) {
        setUser({ ...user, email: data.newEmail });
        setIsEditingEmail(false);
        emailForm.reset({ newEmail: data.newEmail });
        toast.success("Email updated successfully!");
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) =>
          emailForm.setError(field as keyof EmailFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
      }
    } catch (err) {
      console.error(err);
      emailForm.setError("newEmail", { message: "Failed to update email" });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      setIsPasswordLoading(true);
      const formData = new FormData();
      formData.append("currentPassword", data.currentPassword);
      formData.append("newPassword", data.newPassword);
      formData.append("confirmNewPassword", data.confirmPassword);

      const result = await updateUserPassword(undefined, formData);

      if (result.success) {
        passwordForm.reset();
        setIsPasswordOpen(false);
        toast.success("Password updated successfully!");
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) =>
          passwordForm.setError(field as keyof PasswordFormData, {
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
      }
    } catch (err) {
      console.error(err);
      passwordForm.setError("currentPassword", { message: "Failed to update password" });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleCancelNameEdit = () => {
    nameForm.reset({ newName: user.username });
    setIsEditingName(false);
  };

  const handleCancelEmailEdit = () => {
    emailForm.reset({ newEmail: user.email });
    setIsEditingEmail(false);
  };

  // --- Render ---
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      {/* Profile Image */}
      <ProfileImageCard user={user} setUser={setUser} />

      {/* Personal Information */}
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
          <CardContent className="pt-0 space-y-6">
            <Separator className="mb-4" />

            {/* Name */}
            <div>
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
                <p className="text-sm font-medium">{user.username}</p>
              ) : (
                <form onSubmit={nameForm.handleSubmit(handleSaveName)} className="space-y-2">
                  <Input {...nameForm.register("newName")} placeholder="Enter your full name" />
                  {nameForm.formState.errors.newName && (
                    <p className="text-sm text-destructive">{nameForm.formState.errors.newName.message}</p>
                  )}
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm" disabled={isNameLoading || !nameForm.formState.isValid}>
                      {isNameLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleCancelNameEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <Separator />

            {/* Email */}
            <div>
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
                  <Input type="email" {...emailForm.register("newEmail")} placeholder="Enter your email" />
                  {emailForm.formState.errors.newEmail && (
                    <p className="text-sm text-destructive">{emailForm.formState.errors.newEmail.message}</p>
                  )}
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm" disabled={isEmailLoading || !emailForm.formState.isValid}>
                      {isEmailLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleCancelEmailEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Change Password */}
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
                <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input id="confirmNewPassword" type="password" {...passwordForm.register("confirmPassword")} />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordLoading || !passwordForm.formState.isValid}>
                  {isPasswordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
