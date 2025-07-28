import React from "react";
import { Button } from "@/components/ui/button";
import { User, Lock, LogOut, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

const Auth0LoginPage = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAccessToken,
    error,
  } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-4xl text-blue-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div>
          <img src={"/purrscribe-logo.png"} alt="PurrScribe Logo" />
        </div>
        <br />

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <User className="w-10 h-10 text-gray-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Welcome, {user?.name || user?.email || "User"}!
                </h2>
                <p className="text-gray-500">
                  Logged in with {user?.email || "Unknown Provider"}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                User Profile:
              </h3>
              <pre className="text-sm text-gray-600 overflow-auto max-h-48">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <Button
              onClick={() => logout()}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Please log in to access your profile.
            </p>
            <Button
              onClick={() => login()}
              variant="default"
              className="w-full flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth0LoginPage;
