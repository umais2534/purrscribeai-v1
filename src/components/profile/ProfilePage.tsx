import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState("vet");
  const [avatarOptions, setAvatarOptions] = useState([
    "vet",
    "doctor",
    "medical",
    "health",
    "care",
    "animal",
    "pet",
  ]);

  const handleAvatarChange = (seed: string) => {
    setAvatarSeed(seed);
    setIsAvatarDialogOpen(false);
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    setAvatarOptions([...avatarOptions, randomSeed]);
    handleAvatarChange(randomSeed);
  };

  return (
    <DashboardLayout>
      <div className="bg-background p-6 rounded-lg w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your account details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                    />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAvatarDialogOpen(true)}
                    >
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Dr. Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue="dr.smith@example.com"
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed. Contact support for
                      assistance.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue="Veterinarian" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Input id="phone" defaultValue="(555) 123-4567" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => {
                          alert("Verification code sent to your phone number");
                        }}
                      >
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Phone number must be verified for account security
                    </p>
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password or enable two-factor authentication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the Premium plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Premium Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Billed monthly
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">$29/month</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing date: June 15, 2023
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">Change Plan</Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="mr-4 bg-muted w-12 h-8 rounded flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-credit-card"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize your application experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Preference settings coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Avatar Change Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
            <DialogDescription>
              Select a new avatar or generate a random one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {avatarOptions.map((seed) => (
              <div
                key={seed}
                className={`cursor-pointer p-2 rounded-md ${avatarSeed === seed ? "ring-2 ring-primary" : "hover:bg-accent"}`}
                onClick={() => handleAvatarChange(seed)}
              >
                <Avatar className="h-16 w-16 mx-auto">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                  />
                  <AvatarFallback>
                    {seed.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-center mt-1 truncate">{seed}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAvatarDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={generateRandomSeed}>Generate Random</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProfilePage;
