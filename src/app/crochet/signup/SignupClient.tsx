"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TextBox,
  Button,
  Card,
  Heading,
  Text,
  Divider,
  useToast,
} from "@/components/elements";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";

export default function SignupClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { showToast } = useToast();
  const router = useRouter();

  const validate = () => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log({ name, email, password });

    showToast("Account created successfully! Welcome to PixieLoops! 🎉", "success");
    setLoading(false);

    // Redirect to home
    router.push("/crochet");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/crochet" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 shadow-lg">
              <span className="text-3xl">🧶</span>
            </div>
            <Heading level={2} gradient>
              PixieLoops
            </Heading>
          </Link>
          <Text variant="muted" className="mt-2">
            Create your account to start shopping
          </Text>
        </div>

        {/* Signup Card */}
        <Card variant="elevated" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextBox
              label="Full Name"
              name="name"
              value={name}
              onChange={setName}
              placeholder="Enter your full name"
              required
              error={errors.name}
              icon={<User className="h-5 w-5" />}
            />

            <TextBox
              label="Email Address"
              name="email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="your@email.com"
              required
              error={errors.email}
              icon={<Mail className="h-5 w-5" />}
            />

            <div className="relative">
              <TextBox
                label="Password"
                name="password"
                value={password}
                onChange={setPassword}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                error={errors.password}
                icon={<Lock className="h-5 w-5" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <TextBox
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                error={errors.confirmPassword}
                icon={<Lock className="h-5 w-5" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Text variant="small" className="text-gray-600">
                I agree to the{" "}
                <Link
                  href="/crochet/terms"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/crochet/privacy"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </Text>
            </label>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              loading={loading}
              disabled={loading}
            >
              <UserPlus className="h-5 w-5" />
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <Divider className="my-6" />

          {/* Social Signup */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => showToast("Google signup coming soon!", "info")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => showToast("Facebook signup coming soon!", "info")}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Text variant="small" className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/crochet/login"
                className="font-semibold text-purple-600 hover:text-purple-700 transition"
              >
                Login
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}