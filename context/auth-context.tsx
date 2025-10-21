"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { FormatTypes } from "@/lib/grades/formats";

interface AuthContextType {
  user: User | null; // User info (name, email, etc.)
  session: Session | null; // Session info (access token, etc.)
  loading: boolean; // Is the app still checking if the user is logged in?
  signIn: (provider: "google" | "apple") => Promise<void>; // Function to sign in
  signOut: () => Promise<void>; // Function to sign out
  defaultGradeFormat: FormatTypes;
}
// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Store user info
  const [session, setSession] = useState<Session | null>(null); // Store session info
  const [loading, setLoading] = useState(true); // Track loading state
  // Check if the user is already logged in when the app starts
  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      const user = session?.user ?? null;

      setUser(user);
      setLoading(false);
    };

    initSession();

    // Listen for changes in the user's login state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    // Cleanup when the component unmounts
    return () => subscription?.unsubscribe();
  }, []);
  // Function to sign in with Google
  const signIn = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}`, // Redirect after login
      },
    });
  };
  // Function to sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };
  // Share the data with the rest of the app
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        defaultGradeFormat: FormatTypes.ONE_TO_SIX,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
