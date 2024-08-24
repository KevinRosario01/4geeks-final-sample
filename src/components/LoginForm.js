import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const LoginForm = ({ onLogin, onClose, onSwitchToSignUp }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loginError, setLoginError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const error = await onLogin(email, password);
    if (error) {
      setLoginError("Invalid login credentials");
    } else {
      setLoginError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-black font-extrabold text-4xl mb-4 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {loginError && (
            <p className="text-red-500 font-extrabold mb-4 text-center">
              {loginError}
            </p>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...form.register("email")}
              className="w-full p-2 border border-gray-300 rounded-lg"
              ref={emailRef}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              {...form.register("password")}
              className="w-full p-2 border border-gray-300 rounded-lg"
              ref={passwordRef}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-bold cursor-pointer hover:underline"
              onClick={onSwitchToSignUp}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
