import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

import { User, UserUpdate } from "../types";
import { HttpResponse, httpCall } from "../api/HttpClient.ts";
import { getUser } from "../services/UserService.ts";

import { errorToast, successToast } from "../main";
import {
  CookieUser,
  JwtDecodedToken,
  UserSignIn,
  UserSignUp,
  AuthError,
  AuthContextType,
} from "../types/Auth.ts";

const useAuthProvider = () => {
  const navigation = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const getUserFromCookie = () => {
    return cookies["user"];
  };

  const [user, setUser] = useState<CookieUser | undefined>(getUserFromCookie());
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<AuthError | undefined>(undefined);

  const isAuthenticated = (): boolean => {
    const isTokenExpired = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return user?.decodedTokenInfo.exp
        ? currentTimestamp >= user.decodedTokenInfo.exp
        : true;
    };

    return user != undefined && !isTokenExpired();
  };

  const isAuthenticatedCompany = () => {
    return user ? user.isCompany : false;
  };

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: UserSignIn) => {
      const data = await httpCall<any[]>({
        url: import.meta.env.VITE_ROUTE_AUTH_LOGIN,
        method: "POST",
        body: {
          email: email,
          password: password,
        },
      });

      return data;
    },
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async (response: any) => {
      setIsLoading(false);

      if (response.success) {
        console.log("zalogowano", response.data.token);
        successToast("Logged in successfully");
        const decodedToken = jwtDecode<JwtDecodedToken>(response.data.token);
        const userInfo = {
          decodedTokenInfo: decodedToken,
          accessToken: response.data.token,
          isCompany: decodedToken.role.toUpperCase() !== "USER",
          userId: decodedToken.sub,
        };
        setUser(userInfo);
        setCookie("user", userInfo, { path: "/" });
        navigation("/");
      } else {
        setIsError({ type: "SignIn", message: response.message });
        errorToast(response.message);
      }
    },
    onError: async (response: string) => {
      console.log(response);
      setIsLoading(false);
      setIsError({ type: "SignIn", message: response });
      errorToast("Could not log in. Please try again.");
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ username, email, password, code }: UserSignUp) => {
      const data = await httpCall<any[]>({
        url: import.meta.env.VITE_ROUTE_AUTH_REGISTER,
        method: "POST",
        body: {
          username: username,
          email: email,
          password: password,
          code: code,
        },
      });

      return data;
    },
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async (response: any) => {
      setIsLoading(false);
      if (response.success) {
        console.log("zarejestrowano");
        successToast("Registered successfully");
        navigation("/login");
      } else {
        navigation("/register");
        setIsError({ type: "SignUp", message: response.message });
        errorToast("Could not register. Please try again.");
      }
    },
    onError: async (response: string) => {
      setIsLoading(false);
      setIsError({ type: "SignUp", message: response });
      errorToast("Could not register. Please try again.");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const data = await httpCall<any>({
        url: import.meta.env.VITE_ROUTE_AUTH_CODE,
        method: "POST",
        body: {
          email: email,
        },
      });

      return data;
    },
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      setIsLoading(false);
    },
    onError: async () => {
      setIsLoading(false);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const data = await httpCall<any>({
        url: import.meta.env.VITE_ROUTE_AUTH_CODE + "?verify=" + code,
        method: "POST",
        body: {
          email: email,
        },
      });

      return data;
    },
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      setIsLoading(false);
    },
    onError: async () => {
      setIsLoading(false);
    },
  });

  const signInWithToken = async (token: string) => {
    if (isAuthenticated()) return;
    try {
      const decodedToken = jwtDecode<JwtDecodedToken>(token);
      const userInfo = {
        decodedTokenInfo: decodedToken,
        accessToken: token,
        isCompany: decodedToken.role.toUpperCase() !== "USER",
        userId: decodedToken.sub,
      };

      setUser(userInfo);
      setCookie("user", userInfo, { path: "/" });
      const userData = await getUser();
      setUserData(userData as User);
      successToast("Logged in successfully");
      navigation("/");
    } catch (e) {
      console.error(e);
      errorToast("Could not log in. Please try again.");
    }
  };

  const signIn = ({ email, password }: UserSignIn) => {
    signInMutation.mutate({ email, password });
    return signInMutation.isSuccess;
  };

  const signUp = ({ username, email, password, code }: UserSignUp) => {
    signUpMutation.mutate({ username, email, password, code });
    return signUpMutation.isSuccess;
  };

  const signOut = () => {
    removeCookie("user", { path: "/" });
    setUser(undefined);
    window.location.reload();
  };

  const verifyEmail = async (email: string) => {
    return await verifyEmailMutation.mutateAsync(email);
  };

  const verifyCode = async (email: string, code: string) => {
    return await verifyCodeMutation.mutateAsync({ email, code });
  };

  const updateUser = async (userUpdates: UserUpdate) => {
    const filteredUpdates = (Object.keys(userUpdates) as (keyof UserUpdate)[])
      .filter((key): key is keyof UserUpdate => userUpdates[key] !== undefined)
      .reduce((obj, key) => {
        obj[key] = userUpdates[key];
        return obj;
      }, {} as UserUpdate);

    return await httpCall<HttpResponse<null>>({
      url: import.meta.env.VITE_API_URL + "/me/update",
      method: "POST",
      body: filteredUpdates,
    });
  };

  useEffect(() => {
    if (cookies["user"]) {
      setUser(cookies["user"]);
      getUser().then((userData) => {
        setUserData(userData as User);
        setIsLoading(false);
      });
    }

    setIsLoading(false);
  }, [cookies]);

  return {
    user,
    userData,
    setUserData,
    accessToken: user ? user.accessToken : null,
    userId: user ? user.userId : undefined,
    isAuthenticated,
    isAuthenticatedCompany,
    signIn,
    signInWithToken,
    signUp,
    signOut,
    verifyEmail,
    verifyCode,
    updateUser,
    isLoading,
    isError,
  };
};

const AuthContext = React.createContext({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
