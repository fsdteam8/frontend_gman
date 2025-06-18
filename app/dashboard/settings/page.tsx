// "use client"

// import React, { useState, useEffect } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { ChevronRight, Pencil, X, Save, Eye, EyeOff } from "lucide-react"
// import { useSession } from "next-auth/react"
// import { toast } from "sonner"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// interface UserProfile {
//   avatar: {
//     public_id: string
//     url: string
//   }
//   address: {
//     street: string
//     city: string
//     state: string
//     zipCode: string
//   }
//   _id: string
//   name: string
//   email: string
//   username: string
//   phone: string
//   credit: number | null
//   role: string
//   fine: number
//   uniqueId: string
//   createdAt: string
//   updatedAt: string
//   __v: number
//   farm: string
//   isStripeOnboarded: boolean
//   stripeAccountId: string
// }

// interface ApiResponse<T> {
//   success: boolean
//   message: string
//   data: T
// }

// interface StripeConnectResponse {
//   url: string
// }

// async function fetchUserProfile(token: string | null): Promise<UserProfile> {
//   if (!token) {
//     throw new Error("No authentication token available")
//   }
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.message || "Failed to fetch profile")
//   }

//   const result: ApiResponse<UserProfile> = await response.json()
//   return result.data
// }

// interface UpdateProfilePayload {
//   name: string
//   username: string
//   phone: string
//   street: string
//   city: string
//   state: string
//   zipCode: string
// }

// async function updateUserProfile(payload: UpdateProfilePayload, token: string | null): Promise<ApiResponse<any>> {
//   if (!token) {
//     throw new Error("No authentication token available")
//   }
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.message || "Failed to update profile")
//   }

//   return response.json()
// }

// interface ChangePasswordPayload {
//   currentPassword: string
//   newPassword: string
//   confirmPassword: string
// }

// async function changeUserPassword(payload: ChangePasswordPayload, token: string | null): Promise<ApiResponse<any>> {
//   if (!token) {
//     throw new Error("No authentication token available")
//   }
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.message || "Failed to change password")
//   }

//   return response.json()
// }

// interface StripeConnectPayload {
//   userId: string
// }

// async function connectStripeAccount(payload: StripeConnectPayload, token: string | null): Promise<StripeConnectResponse> {
//   if (!token) {
//     throw new Error("No authentication token available")
//   }
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/connect`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.message || "Failed to connect Stripe account")
//   }

//   return response.json()
// }

// export default function SettingsPage() {
//   const queryClient = useQueryClient()
//   const { data: session, status } = useSession()
//   const token = session?.accessToken ?? null

//   const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
//   const [isEditingProfile, setIsEditingProfile] = useState(false)
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//   const [showNewPassword, setShowNewPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   // Fetch user profile
//   const {
//     data: userProfile,
//     isLoading: isLoadingProfile,
//     isError: isErrorProfile,
//     error: profileError,
//   } = useQuery<UserProfile, Error>({
//     queryKey: ["userProfile", token],
//     queryFn: () => fetchUserProfile(token),
//     enabled: !!token && status === "authenticated",
//   })

//   // Profile form state
//   const [profileFormData, setProfileFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   })

//   // Sync profile form data when userProfile changes
//   useEffect(() => {
//     if (userProfile) {
//       setProfileFormData({
//         name: userProfile.name || "",
//         username: userProfile.username || "",
//         email: userProfile.email || "",
//         phone: userProfile.phone || "",
//         street: userProfile.address?.street || "",
//         city: userProfile.address?.city || "",
//         state: userProfile.address?.state || "",
//         zipCode: userProfile.address?.zipCode || "",
//       })
//     }
//   }, [userProfile])

//   // Update profile mutation
//   const updateProfileMutation = useMutation<ApiResponse<any>, Error, UpdateProfilePayload>({
//     mutationFn: (payload) => updateUserProfile(payload, token),
//     onSuccess: () => {
//       toast.success("Profile updated successfully.")
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] })
//       setIsEditingProfile(false)
//     },
//     onError: (err) => {
//       toast.error(err.message || "Failed to update profile. Please try again.")
//     },
//   })

//   // Stripe connect mutation
//   const stripeConnectMutation = useMutation<StripeConnectResponse, Error, StripeConnectPayload>({
//     mutationFn: (payload) => connectStripeAccount(payload, token),
//     onSuccess: (data) => {
//       window.location.href = data.url
//     },
//     onError: (err) => {
//       toast.error(err.message || "Failed to connect Stripe account. Please try again.")
//     },
//   })

//   // Handle profile form changes
//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target
//     setProfileFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   // Handle profile form submission
//   const handleProfileSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Basic validation
//     if (!profileFormData.name || !profileFormData.username) {
//       toast.error("Name and username are required.")
//       return
//     }
//     updateProfileMutation.mutate({
//       name: profileFormData.name,
//       username: profileFormData.username,
//       phone: profileFormData.phone,
//       street: profileFormData.street,
//       city: profileFormData.city,
//       state: profileFormData.state,
//       zipCode: profileFormData.zipCode,
//     })
//   }

//   // Cancel profile edit
//   const handleCancelProfileEdit = () => {
//     if (userProfile) {
//       setProfileFormData({
//         name: userProfile.name || "",
//         username: userProfile.username || "",
//         email: userProfile.email || "",
//         phone: userProfile.phone || "",
//         street: userProfile.address?.street || "",
//         city: userProfile.address?.city || "",
//         state: userProfile.address?.state || "",
//         zipCode: userProfile.address?.zipCode || "",
//       })
//     }
//     setIsEditingProfile(false)
//   }

//   // Password form state
//   const [passwordFormData, setPasswordFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   // Change password mutation
//   const changePasswordMutation = useMutation<ApiResponse<any>, Error, ChangePasswordPayload>({
//     mutationFn: (payload) => changeUserPassword(payload, token),
//     onSuccess: () => {
//       toast.success("Password changed successfully.")
//       setPasswordFormData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       })
//       setShowChangePasswordForm(false)
//       setShowCurrentPassword(false)
//       setShowNewPassword(false)
//       setShowConfirmPassword(false)
//     },
//     onError: (err) => {
//       toast.error(err.message || "Failed to change password. Please try again.")
//     },
//   })

//   // Handle password form changes
//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target
//     setPasswordFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   // Handle password form submission
//   const handlePasswordSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Validate passwords
//     if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
//       toast.error("New password and confirm password do not match.")
//       return
//     }
//     if (passwordFormData.newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters long.")
//       return
//     }
//     changePasswordMutation.mutate(passwordFormData)
//   }

//   // Handle Stripe connect button click
//   const handleStripeConnect = () => {
//     if (userProfile?._id) {
//       stripeConnectMutation.mutate({ userId: userProfile._id })
//     } else {
//       toast.error("User profile not loaded. Please try again.")
//     }
//   }

//   // Authentication check
//   if (status === "loading") {
//     return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Loading...</div>
//   }

//   if (status === "unauthenticated") {
//     return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Please sign in to view this page.</div>
//   }

//   // Loading state
//   if (isLoadingProfile) {
//     return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Loading profile...</div>
//   }

//   // Error state
//   if (isErrorProfile) {
//     return (
//       <div className="flex flex-col min-h-screen p-4">
//         Error loading profile: {profileError?.message || "Unknown error"}
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen ">
//       <main className="flex-1">
//         <div>
//           {/* Breadcrumbs and Add Stripe Account Button */}
//           <h2 className="text-2xl font-semibold  text-[#272727]">Settings</h2>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center text-sm text-gray-500">
//               <span>Dashboard</span>
//               <ChevronRight className="w-4 h-4 mx-1" />
//               <span>Settings</span>
//             </div>
//             <div>
//               <Button
//                 className="text-white bg-[#038C05] hover:bg-[#038C05]/80 !h-[50px] rounded-[10px] font-semibold text-base"
//                 onClick={handleStripeConnect}
//                 disabled={stripeConnectMutation.isPending}
//               >
//                 {stripeConnectMutation.isPending ? "Connecting..." : "Add Stripe Account"}
//               </Button>
//             </div>
//           </div>

//           {/* Conditional Rendering of Forms */}
//           {showChangePasswordForm ? (
//             // Change Password Form
//             <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-6">
//               <h2 className="text-xl font-semibold mb-4">Change Password</h2>
//               <div className="space-y-2 relative">
//                 <Label htmlFor="currentPassword">Current Password</Label>
//                 <Input
//                   id="currentPassword"
//                   type={showCurrentPassword ? "text" : "password"}
//                   value={passwordFormData.currentPassword}
//                   onChange={handlePasswordChange}
//                   required
//                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                 >
//                   {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               <div className="space-y-2 relative">
//                 <Label htmlFor="newPassword">New Password</Label>
//                 <Input
//                   id="newPassword"
//                   type={showNewPassword ? "text" : "password"}
//                   value={passwordFormData.newPassword}
//                   onChange={handlePasswordChange}
//                   required
//                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                 >
//                   {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               <div className="space-y-2 relative">
//                 <Label htmlFor="confirmPassword">Confirm New Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={passwordFormData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   required
//                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>

//               <div className="flex justify-end space-x-4 mt-6">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="text-gray-600 hover:bg-gray-100"
//                   onClick={() => setShowChangePasswordForm(false)}
//                   disabled={changePasswordMutation.isPending}
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-[#039B06] hover:bg-[#039B06]/80 text-white"
//                   disabled={changePasswordMutation.isPending}
//                 >
//                   {changePasswordMutation.isPending ? "Saving..." : "Save Password"}
//                   <Save className="w-4 h-4 ml-2" />
//                 </Button>
//               </div>
//             </form>
//           ) : (
//             // Profile Settings Form
//             <>
//               {/* Profile Section */}
//               <div className="flex flex-col md:flex-row items-center md:justify-between  mb-6">
//                 <div className="flex items-center space-x-4">
//                   <Avatar className="w-20 h-20">
//                     <AvatarImage
//                       src={userProfile?.avatar?.url || "/placeholder.svg?height=80&width=80"}
//                       alt={userProfile?.name || "User Avatar"}
//                     />
//                     <AvatarFallback>
//                       {userProfile?.name ? userProfile.name.substring(0, 2).toUpperCase() : "US"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h2 className="text-xl font-semibold">{userProfile?.name || "User"}</h2>
//                     <p className="text-gray-500">@{userProfile?.username || "username"}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-4 mt-4 md:mt-0">
//                   <Button
//                     variant="outline"
//                     className="border-gray-300 text-gray-700 hover:bg-gray-100"
//                     onClick={() => setShowChangePasswordForm(true)}
//                   >
//                     Change Password
//                   </Button>
//                   {!isEditingProfile ? (
//                     <Button
//                       className="bg-green-500 hover:bg-green-600 text-white"
//                       onClick={() => setIsEditingProfile(true)}
//                     >
//                       <Pencil className="w-4 h-4 mr-2" />
//                       Update Profile
//                     </Button>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Profile Form */}
//               <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal" htmlFor="name">Full Name</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={profileFormData.name}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                     required={isEditingProfile}
//                     className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     type="text"
//                     value={profileFormData.username}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                     required={isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={profileFormData.email}
//                     readOnly={true}
//                     onChange={handleProfileChange}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     value={profileFormData.phone}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="street">Street</Label>
//                   <Input
//                     id="street"
//                     type="text"
//                     value={profileFormData.street}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="city">City</Label>
//                   <Input
//                     id="city"
//                     type="text"
//                     value={profileFormData.city}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="state">State</Label>
//                   <Input
//                     id="state"
//                     type="text"
//                     value={profileFormData.state}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-base text-[#707070] font-normal"  htmlFor="zipCode">Zip Code</Label>
//                   <Input
//                     id="zipCode"
//                     type="text"
//                     value={profileFormData.zipCode}
//                     onChange={handleProfileChange}
//                     readOnly={!isEditingProfile}
//                      className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
//                   />
//                 </div>

//                 {/* Action Buttons */}
//                 {isEditingProfile && (
//                   <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       className="text-gray-600 hover:bg-gray-100"
//                       onClick={handleCancelProfileEdit}
//                       disabled={updateProfileMutation.isPending}
//                     >
//                       <X className="w-4 h-4 mr-2" />
//                       Cancel
//                     </Button>
//                     <Button
//                       type="submit"
//                       className="bg-green-500 hover:bg-green-600 text-white"
//                       disabled={updateProfileMutation.isPending}
//                     >
//                       {updateProfileMutation.isPending ? "Saving..." : "Save"}
//                       <Save className="w-4 h-4 ml-2" />
//                     </Button>
//                   </div>
//                 )}
//               </form>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronRight, Pencil, X, Save, Eye, EyeOff } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Interface for Address
interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

// Interface for Avatar
interface AvatarData {
  public_id: string
  url: string
}

// Interface for UserProfile
interface UserProfile {
  avatar: AvatarData
  address: Address
  _id: string
  name: string
  email: string
  username: string
  phone: string
  credit: number | null
  role: string
  fine: number
  uniqueId: string
  createdAt: string
  updatedAt: string
  __v: number
  farm: string
  isStripeOnboarded: boolean
  stripeAccountId: string
}

// Generic API Response Interface
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Interface for Update Profile Response
interface UpdateProfileResponse {
  user: UserProfile
}

// Interface for Change Password Response
interface ChangePasswordResponse {
  message: string
}

// Interface for Stripe Connect Response
interface StripeConnectResponse {
  url: string
}

// Fetch user profile
async function fetchUserProfile(token: string | null): Promise<UserProfile> {
  if (!token) {
    throw new Error("No authentication token available")
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch profile")
  }

  const result: ApiResponse<UserProfile> = await response.json()
  return result.data
}

// Payload for updating profile
interface UpdateProfilePayload {
  name: string
  username: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
}

// Update user profile
async function updateUserProfile(payload: UpdateProfilePayload, token: string | null): Promise<UpdateProfileResponse> {
  if (!token) {
    throw new Error("No authentication token available")
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update profile")
  }

  const result: ApiResponse<UpdateProfileResponse> = await response.json()
  return result.data
}

// Payload for changing password
interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Change user password
async function changeUserPassword(payload: ChangePasswordPayload, token: string | null): Promise<ChangePasswordResponse> {
  if (!token) {
    throw new Error("No authentication token available")
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to change password")
  }

  const result: ApiResponse<ChangePasswordResponse> = await response.json()
  return result.data
}

// Payload for Stripe connect
interface StripeConnectPayload {
  userId: string
}

// Connect Stripe account
async function connectStripeAccount(payload: StripeConnectPayload, token: string | null): Promise<StripeConnectResponse> {
  if (!token) {
    throw new Error("No authentication token available")
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to connect Stripe account")
  }

  return response.json()
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const token = session?.accessToken ?? null

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: profileError,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile", token],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token && status === "authenticated",
  })

  // Profile form state
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Sync profile form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileFormData({
        name: userProfile.name || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        street: userProfile.address?.street || "",
        city: userProfile.address?.city || "",
        state: userProfile.address?.state || "",
        zipCode: userProfile.address?.zipCode || "",
      })
    }
  }, [userProfile])

  // Update profile mutation
  const updateProfileMutation = useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
    mutationFn: (payload) => updateUserProfile(payload, token),
    onSuccess: () => {
      toast.success("Profile updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      setIsEditingProfile(false)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile. Please try again.")
    },
  })

  // Stripe connect mutation
  const stripeConnectMutation = useMutation<StripeConnectResponse, Error, StripeConnectPayload>({
    mutationFn: (payload) => connectStripeAccount(payload, token),
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (err) => {
      toast.error(err.message || "Failed to connect Stripe account. Please try again.")
    },
  })

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfileFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (!profileFormData.name || !profileFormData.username) {
      toast.error("Name and username are required.")
      return
    }
    updateProfileMutation.mutate({
      name: profileFormData.name,
      username: profileFormData.username,
      phone: profileFormData.phone,
      street: profileFormData.street,
      city: profileFormData.city,
      state: profileFormData.state,
      zipCode: profileFormData.zipCode,
    })
  }

  // Cancel profile edit
  const handleCancelProfileEdit = () => {
    if (userProfile) {
      setProfileFormData({
        name: userProfile.name || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        street: userProfile.address?.street || "",
        city: userProfile.address?.city || "",
        state: userProfile.address?.state || "",
        zipCode: userProfile.address?.zipCode || "",
      })
    }
    setIsEditingProfile(false)
  }

  // Password form state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Change password mutation
  const changePasswordMutation = useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
    mutationFn: (payload) => changeUserPassword(payload, token),
    onSuccess: () => {
      toast.success("Password changed successfully.")
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowChangePasswordForm(false)
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to change password. Please try again.")
    },
  })

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate passwords
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New password and confirm password do not match.")
      return
    }
    if (passwordFormData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.")
      return
    }
    changePasswordMutation.mutate(passwordFormData)
  }

  // Handle Stripe connect button click
  const handleStripeConnect = () => {
    if (userProfile?._id) {
      stripeConnectMutation.mutate({ userId: userProfile._id })
    } else {
      toast.error("User profile not loaded. Please try again.")
    }
  }

  // Authentication check
  if (status === "loading") {
    return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Please sign in to view this page.</div>
  }

  // Loading state
  if (isLoadingProfile) {
    return <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">Loading profile...</div>
  }

  // Error state
  if (isErrorProfile) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        Error loading profile: {profileError?.message || "Unknown error"}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div>
          {/* Breadcrumbs and Add Stripe Account Button */}
          <h2 className="text-2xl font-semibold text-[#272727]">Settings</h2>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>Settings</span>
            </div>
            <div>
              <Button
                className="text-white bg-[#038C05] hover:bg-[#038C05]/80 !h-[50px] rounded-[10px] font-semibold text-base"
                onClick={handleStripeConnect}
                disabled={stripeConnectMutation.isPending}
              >
                {stripeConnectMutation.isPending ? "Connecting..." : "Add Stripe Account"}
              </Button>
            </div>
          </div>

          {/* Conditional Rendering of Forms */}
          {showChangePasswordForm ? (
            // Change Password Form
            <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <div className="space-y-2 relative">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-600 hover:bg-gray-100"
                  onClick={() => setShowChangePasswordForm(false)}
                  disabled={changePasswordMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#039B06] hover:bg-[#039B06]/80 text-white"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Saving..." : "Save Password"}
                  <Save className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          ) : (
            // Profile Settings Form
            <>
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={userProfile?.avatar?.url || "/placeholder.svg?height=80&width=80"}
                      alt={userProfile?.name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {userProfile?.name ? userProfile.name.substring(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{userProfile?.name || "User"}</h2>
                    <p className="text-gray-500">@{userProfile?.username || "username"}</p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowChangePasswordForm(true)}
                  >
                    Change Password
                  </Button>
                  {!isEditingProfile ? (
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="name">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileFormData.name}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    required={isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="username">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={profileFormData.username}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    required={isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileFormData.email}
                    readOnly={true}
                    onChange={handleProfileChange}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileFormData.phone}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="street">
                    Street
                  </Label>
                  <Input
                    id="street"
                    type="text"
                    value={profileFormData.street}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="city">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={profileFormData.city}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="state">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={profileFormData.state}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base text-[#707070] font-normal" htmlFor="zipCode">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={profileFormData.zipCode}
                    onChange={handleProfileChange}
                    readOnly={!isEditingProfile}
                    className="h-[50px] rounded-[4px] text-base text-[#272727] font-normal"
                  />
                </div>

                {/* Action Buttons */}
                {isEditingProfile && (
                  <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-600 hover:bg-gray-100"
                      onClick={handleCancelProfileEdit}
                      disabled={updateProfileMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}