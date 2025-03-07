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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Join NoteHub and start your learning journey
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="emailId"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Create a password"
              />
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
              {isLoading ? "Creating your account..." : "Create account"}
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
                Already have an account?
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/signin"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-150"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
