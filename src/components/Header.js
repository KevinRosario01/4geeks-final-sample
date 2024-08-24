"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';  // Assuming you have an AuthContext for global state
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';

const supabase = createClient();

export default function Header() {
  const { user, setUser } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleLogin = async (email, password) => {
    const { error, user } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error);
      return error;
    } else {
      setUser(user);
      setIsLoginOpen(false);  // Close the login modal on successful login
      return null;
    }
  };

  const handleSignUp = async (firstName, lastName, email, password) => {
    const { error, user } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) {
      console.error("Signup error:", error);
      return error;
    } else {
      setUser(user);
      setIsSignUpOpen(false);  // Close the signup modal on successful signup
      return null;
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);  // Clear the user state after logout
    }
  };

  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <a href="/" className="text-2xl font-bold">
          RateMyProfessor
        </a>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <span>Welcome, {user.first_name}</span>
              {user.role === 'admin' && (
                <a
                  href="/admin"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Admin Menu
                </a>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setIsSignUpOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginForm
          onLogin={handleLogin}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignUp={() => {
            setIsLoginOpen(false);
            setIsSignUpOpen(true);
          }}
        />
      )}

      {/* Signup Modal */}
      {isSignUpOpen && (
        <SignUpForm
          onSignUp={handleSignUp}
          onClose={() => setIsSignUpOpen(false)}
          onSwitchToLogin={() => {
            setIsSignUpOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </header>
  );
}
