"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/app/api/auth";
import { useAuthStore } from "@/stores/store";
import { SignInData, SignInResponse } from "@/types/auth";

export default function SignInForm() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState<SignInData>({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignInData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (data: SignInResponse) => {
      const user = {
        userName: data.userName,
        userId: data.userId,
      };
      setToken(data.token);
      setUser(user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<SignInData> = {};
    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{" "}
          <Link
            href="/signup"
            className="font-medium text-accent hover:text-accent/90"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          {mutation.isError && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-md">
              {(mutation.error as Error).message || "Failed to sign in"}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.userName
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent"
                  } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
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
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent"
                  } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
