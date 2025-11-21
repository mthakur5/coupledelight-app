"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthModalsProps {
  showLogin: boolean;
  showRegister: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
}

export default function AuthModals({
  showLogin,
  showRegister,
  onClose,
  onSwitchToRegister,
  onSwitchToLogin,
}: AuthModalsProps) {
  return (
    <>
      {showLogin && <LoginModal onClose={onClose} onSwitchToRegister={onSwitchToRegister} />}
      {showRegister && <RegisterModal onClose={onClose} onSwitchToLogin={onSwitchToLogin} />}
    </>
  );
}

function LoginModal({ onClose, onSwitchToRegister }: { onClose: () => void; onSwitchToRegister: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        onClose();
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-rose-500/20">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              Sign In
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="text-rose-300 hover:text-rose-200 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-rose-200 text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-rose-200 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-rose-200">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-rose-400 hover:text-rose-300 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    coupleName: "",
    partner1Name: "",
    partner1Age: "",
    partner2Name: "",
    partner2Age: "",
    location: "",
    bio: "",
    interests: "",
    lookingFor: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    setError("");
    
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill all required fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.coupleName || !formData.partner1Name || !formData.partner1Age || !formData.partner2Name || !formData.partner2Age) {
        setError("Please fill all required fields");
        return false;
      }
      if (parseInt(formData.partner1Age) < 18 || parseInt(formData.partner2Age) < 18) {
        setError("Both partners must be 18 years or older");
        return false;
      }
    }
    
    if (step === 3) {
      if (!formData.location || !formData.lookingFor) {
        setError("Please fill all required fields");
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          profile: {
            coupleName: formData.coupleName,
            partner1Name: formData.partner1Name,
            partner1Age: parseInt(formData.partner1Age),
            partner2Name: formData.partner2Name,
            partner2Age: parseInt(formData.partner2Age),
            location: formData.location,
            bio: formData.bio,
            interests: formData.interests,
            lookingFor: formData.lookingFor,
          }
        }),
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registration successful but login failed. Please try logging in.");
      } else {
        onClose();
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-rose-500/20 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                Join the Community
              </h2>
              <p className="text-rose-300/60 text-sm mt-1">Step {step} of {totalSteps}</p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-rose-300 hover:text-rose-200 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full ${
                    s <= step ? 'bg-gradient-to-r from-rose-500 to-purple-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Account Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-rose-200 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-rose-200 text-sm font-medium mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="Min 6 characters"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-rose-200 text-sm font-medium mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="Repeat password"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Couple Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="coupleName" className="block text-rose-200 text-sm font-medium mb-2">
                    Couple Name *
                  </label>
                  <input
                    id="coupleName"
                    name="coupleName"
                    type="text"
                    required
                    value={formData.coupleName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="Your couple name"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="partner1Name" className="block text-rose-200 text-sm font-medium mb-2">
                      Partner 1 Name *
                    </label>
                    <input
                      id="partner1Name"
                      name="partner1Name"
                      type="text"
                      required
                      value={formData.partner1Name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                      placeholder="First partner"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="partner1Age" className="block text-rose-200 text-sm font-medium mb-2">
                      Age *
                    </label>
                    <input
                      id="partner1Age"
                      name="partner1Age"
                      type="number"
                      required
                      min="18"
                      value={formData.partner1Age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                      placeholder="18+"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="partner2Name" className="block text-rose-200 text-sm font-medium mb-2">
                      Partner 2 Name *
                    </label>
                    <input
                      id="partner2Name"
                      name="partner2Name"
                      type="text"
                      required
                      value={formData.partner2Name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                      placeholder="Second partner"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="partner2Age" className="block text-rose-200 text-sm font-medium mb-2">
                      Age *
                    </label>
                    <input
                      id="partner2Age"
                      name="partner2Age"
                      type="number"
                      required
                      min="18"
                      value={formData.partner2Age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                      placeholder="18+"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Preferences */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-rose-200 text-sm font-medium mb-2">
                    Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="City, Country"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="lookingFor" className="block text-rose-200 text-sm font-medium mb-2">
                    Looking For *
                  </label>
                  <select
                    id="lookingFor"
                    name="lookingFor"
                    required
                    value={formData.lookingFor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    disabled={loading}
                  >
                    <option value="">Select preference</option>
                    <option value="couples">Other Couples</option>
                    <option value="singles">Singles</option>
                    <option value="both">Both Couples & Singles</option>
                    <option value="groups">Group Experiences</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: About You */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="interests" className="block text-rose-200 text-sm font-medium mb-2">
                    Interests
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="e.g., Soft swap, Full swap, Voyeurism..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-rose-200 text-sm font-medium mb-2">
                    About Us
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-rose-500/30 rounded-lg text-white placeholder-rose-300/50 focus:outline-none focus:border-rose-500"
                    placeholder="Tell others about yourselves and what you're looking for..."
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  Previous
                </button>
              )}
              
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-rose-200">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}