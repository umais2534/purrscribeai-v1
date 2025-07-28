import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    isLoading,
    getAccessTokenSilently,
    error,
  } = useAuth0();

  const login = () => loginWithRedirect();

  const logoutUser = () => {
    // Remove any local storage items if needed
    localStorage.removeItem("isAuthenticated");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // For backward compatibility with the existing code
  if (isAuthenticated && !isLoading) {
    localStorage.setItem("isAuthenticated", "true");
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout: logoutUser,
    getAccessToken: getAccessTokenSilently,
    error,
  };
};
