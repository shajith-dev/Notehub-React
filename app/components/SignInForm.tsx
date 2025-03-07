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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to continue to NoteHub
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-accent hover:text-accent/90"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="ml-3">
                  <div className="text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to NoteHub?
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/signup"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-150"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
