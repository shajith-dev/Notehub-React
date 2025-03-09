"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { SignUpData } from "@/types/auth";

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUpData>({
    userName: "",
    emailId: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      router.push("/signin");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<SignUpData> = {};
    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = "Entered value does not match email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must have at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      mutation.mutate(formData);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
          Join NoteHub
        </h2>
        <p className="mt-3 text-center text-lg text-gray-600 dark:text-gray-400">
          Create your account to unlock all features
        </p>
        <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-accent hover:text-accent/90 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-gray-800 py-10 px-8 shadow-xl sm:rounded-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
          {mutation.isError && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-base rounded-lg border border-red-200 dark:border-red-800">
              {(mutation.error as Error).message || "Failed to sign up"}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="userName"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Username
              </label>
              <div>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.userName
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent text-base transition-all duration-200`}
                />
                {errors.userName && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.userName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="emailId"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <div>
                <input
                  id="emailId"
                  name="emailId"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.emailId
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent text-base transition-all duration-200`}
                />
                {errors.emailId && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.emailId}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.password
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent text-base transition-all duration-200`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:translate-y-[-1px]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
