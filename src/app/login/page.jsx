/*import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}*/
"use client"

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async () => {
    const { email, password } = form.getValues();

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      router.push("/");
    }
  };

  const handleSignup = async (formData) => {
    const { email, password } = form.getValues();

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error) {
      router.push("/");
    }
  };

  return (
<form action={handleLogin} class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-semibold mb-6 text-gray-800">Log In</h2>

  <div class="mb-4">
    <label htmlFor="email" class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
    <input
      id="email"
      name="email"
      type="email"
      {...form.register("email")}
      required
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      placeholder="you@example.com"
    />
  </div>

  <div class="mb-4">
    <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
    <input
      id="password"
      name="password"
      type="password"
      {...form.register("password")}
      required
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      placeholder="********"
    />
  </div>

  <div class="flex items-center justify-between mt-6">
    <button
      type="submit"
      class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={handleLogin}
    >
      Log In
    </button>

    <button
      type="button"
      class="w-full ml-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      onClick={handleSignup}
    >
      Sign Up
    </button>
  </div>
</form>

  );
}
