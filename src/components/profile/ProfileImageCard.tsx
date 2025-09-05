"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateUserImage } from "../../../actions/profile";
import { UserProfile } from "@/hooks/UserContext";

interface ProfileImageCardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const ProfileImageCard: React.FC<ProfileImageCardProps> = ({ user, setUser }) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 5 * 1024 * 1024) return alert("Image size should be less than 5MB.");

    try {
      setIsUploadingImage(true);

      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);

      const result = await updateUserImage(file);

      if (result.success) {
        setUser({ ...user, avatar: result.imageUrl });
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setPreviewImage(null);
      }
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewImage || user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">
                {user.username.split(" ").map((n) => n[0]).join("")}
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
            <h3 className="text-lg font-semibold">{user.username}</h3>
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
                    setPreviewImage(null);
                    setUser({ ...user, avatar: user.avatar });
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
