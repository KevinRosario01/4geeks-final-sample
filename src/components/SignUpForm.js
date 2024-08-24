import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = ({ onSignUp, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const schoolNameRef = useRef(null);
  const [signUpError, setSignUpError] = useState("");

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      schoolName: "",
    },
  });

  const handleFirstStepSubmit = (event) => {
    event.preventDefault();
    const emailValue = event.target.email.value;
    const passwordValue = event.target.password.value;

    if (emailValue && passwordValue) {
      setEmail(emailValue);
      setPassword(passwordValue);
      setStep(2);
      setSignUpError("");  // Clear error message when moving to the next step
    } else {
      setSignUpError("Email and Password are required");
    }
  };

  const handleSecondStepSubmit = async (event) => {
    event.preventDefault();
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const schoolName = schoolNameRef.current.value;

    const error = await onSignUp(firstName, lastName, schoolName, email, password);
    if (error) {
      setSignUpError(error);  // Set the error message returned from the API
    } else {
      setSignUpError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-black font-extrabold text-4xl mb-4 text-center">
          Sign Up
        </h2>
        {signUpError && (
          <p className="text-red-500 font-extrabold mb-4 text-center">
            {signUpError}
          </p>
        )}
        {step === 1 && (
          <form onSubmit={handleFirstStepSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg"
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
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-gray-400"
              >
                Close
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSecondStepSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                {...form.register("firstName")}
                className="w-full p-2 border border-gray-300 rounded-lg"
                ref={firstNameRef}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                {...form.register("lastName")}
                className="w-full p-2 border border-gray-300 rounded-lg"
                ref={lastNameRef}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="schoolName" className="block text-gray-700 mb-2">
                School Name
              </label>
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                {...form.register("schoolName")}
                className="w-full p-2 border border-gray-300 rounded-lg"
                ref={schoolNameRef}
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
                className="text-white hover:text-gray-400"
              >
                Close
              </button>
            </div>
          </form>
        )}
        {step === 1 && (
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-bold cursor-pointer hover:underline"
                onClick={onSwitchToLogin}
              >
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
