"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  Pencil,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UpdateFarm from "./_components/updateFarm";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Avatar {
  public_id: string;
  url: string;
}

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  avatar: Avatar | File | null;
  address: Address;
  credit: number | null;
  role: string;
  fine: number;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
  isStripeOnboarded: boolean;
  farm: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

interface StripeConnectResponse {
  url: string;
}

export default function BuyerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const session = useSession();
  const token = session.data?.accessToken;
  const router = useRouter();

  const fetchProfile = async (): Promise<ApiResponse<ProfileData>> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error("Failed to fetch profile");
    }
    return response.json();
  };

  const updateProfile = async (
    profileData: Partial<ProfileData> & { avatar?: File | null }
  ): Promise<ApiResponse<ProfileData>> => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", profileData.name || "");
    formDataToSend.append("username", profileData.username || "");
    formDataToSend.append("phone", profileData.phone || "");
    formDataToSend.append("street", profileData.address?.street || "");
    formDataToSend.append("city", profileData.address?.city || "");
    formDataToSend.append("state", profileData.address?.state || "");
    formDataToSend.append("zipCode", profileData.address?.zipCode || "");
    if (profileData.avatar !== undefined) {
      if (profileData.avatar === null) {
        formDataToSend.append("avatar", "");
      } else {
        formDataToSend.append("avatar", profileData.avatar);
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error("Failed to update profile");
    }
    return response.json();
  };

  const changePassword = async (
    passwordData: PasswordChangeData
  ): Promise<PasswordChangeResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }
    return response.json();
  };

  const connectStripe = async (
    userId: string
  ): Promise<StripeConnectResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/connect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to connect Stripe account");
    }
    return response.json();
  };

  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      setFormData({});
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setShowPasswordChange(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const stripeMutation = useMutation({
    mutationFn: connectStripe,
    onSuccess: (data) => {
      router.push(data.url);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to connect Stripe account");
    },
  });

  const profile = profileResponse?.data;

  const farmId = profile?.farm;

  const handleEditClick = () => {
    if (!isEditing && profile) {
      setFormData({
        name: profile.name,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        avatar: profile.avatar,
      });
      setImagePreview(
        profile.avatar && !(profile.avatar instanceof File)
          ? profile.avatar.url
          : null
      );
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1] as keyof Address;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        } as Address,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePasswordChange = (
    field: keyof PasswordChangeData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size must be less than 5MB.");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      ...formData,
      avatar:
        selectedImage !== undefined
          ? selectedImage
          : profile?.avatar
          ? undefined
          : null,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out: " + (error as Error).message);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordMutation.mutate(passwordData);
  };

  const handleStripeConnect = () => {
    if (profile?._id) {
      stripeMutation.mutate(profile._id);
    } else {
      toast.error("User ID not found");
    }
  };

  const togglePasswordChange = () => {
    setShowPasswordChange(!showPasswordChange);
    if (isEditing) {
      setIsEditing(false);
      setFormData({});
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 md:py-12">
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-16" />
              </CardHeader>
            </Card>
          </div>
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
                <Skeleton className="h-10" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 md:py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message.includes("Unauthorized")
              ? "Session expired. Please login again."
              : "Failed to load profile data. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="flex items-center justify-between">
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <UpdateFarm farmId={farmId ?? ""} />
            <Button
              onClick={handleStripeConnect}
              disabled={stripeMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white font-bold h-[48px] px-4 rounded"
            >
              {stripeMutation.isPending && (
                <Loader2 className="mr-2 w-4 animate-spin" />
              )}
              {profile.isStripeOnboarded
                ? "Stripe Connect"
                : "Add Stripe Account"}
            </Button>
          </div>
        </div>
      </div>
      <div className="py-4 flex justify-end">
        <Link
          href="/dashboard/stripe"
          className="text-green-600  flex items-center gap-2"
        >
          Go to your stripe dashboard <ArrowRight />
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage
                      src={
                        imagePreview ||
                        (profile.avatar && !(profile.avatar instanceof File)
                          ? profile.avatar.url
                          : "/placeholder.svg?height=64&width=64")
                      }
                      alt={`@${profile.username}`}
                    />
                    <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>
              </div>
              {!showPasswordChange && (
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            {isEditing && (
              <CardContent>
                <div className="grid gap-4">
                  <Label htmlFor="avatar">Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="w-auto"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {showPasswordChange
                  ? "Change Password"
                  : "Personal Information"}
              </CardTitle>
              <div className="flex gap-2">
                {showPasswordChange ? (
                  <Button variant="outline" onClick={togglePasswordChange}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={togglePasswordChange}>
                      Change Password
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Log Out
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1 md:hidden"
                      onClick={handleEditClick}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showPasswordChange ? (
                <form className="grid gap-6" onSubmit={handlePasswordSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="old-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="old-password"
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={passwordMutation.isPending}
                    >
                      {passwordMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Change Password
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  className="grid gap-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        placeholder="Enter your full name"
                        value={isEditing ? formData.name || "" : profile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">User name</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={
                          isEditing ? formData.username || "" : profile.username
                        }
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={isEditing ? formData.email || "" : profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={isEditing ? formData.phone || "" : profile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Street</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      value={
                        isEditing
                          ? formData.address?.street || ""
                          : profile.address.street
                      }
                      onChange={(e) =>
                        handleInputChange("address.street", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Enter your city"
                        value={
                          isEditing
                            ? formData.address?.city || ""
                            : profile.address.city
                        }
                        onChange={(e) =>
                          handleInputChange("address.city", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Enter your state"
                        value={
                          isEditing
                            ? formData.address?.state || ""
                            : profile.address.state
                        }
                        onChange={(e) =>
                          handleInputChange("address.state", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    MBS{" "}
                    <div className="grid gap-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input
                        id="zip"
                        placeholder="Enter your zip code"
                        value={
                          isEditing
                            ? formData.address?.zipCode || ""
                            : profile.address.zipCode
                        }
                        onChange={(e) =>
                          handleInputChange("address.zipCode", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
