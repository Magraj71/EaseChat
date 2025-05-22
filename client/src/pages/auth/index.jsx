import * as React from "react";
import { useState } from "react";
import Background from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiclient from "@/lib/api-client.js";
import { LOGIN_ROUTE } from "@/utils/constant"; // Ensure this is correctly defined
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores";

const Auth = () => {
  const navigate = useNavigate(); // ✅ FIXED useNavigate()
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });

  // Define signup route
  const SIGNUP_ROUTE = "/api/auth/signup";

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation functions
  const validatelogin = () => {
    if (!form.email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!form.password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!form.email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!form.password.length) {
      toast.error("Password is required");
      return false;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (validatelogin()) {
      setLoading(true);
      try {
        const response = await apiclient.post(LOGIN_ROUTE, { email: form.email, password: form.password }, { withCredentials: true });
        if (response.status === 200) {
          setUserInfo(response.data.user);
          toast.success("Login successful!");
          setForm({ email: "", password: "", confirm: "" }); // ✅ Reset form
          navigate(response.data.user.ProfileSetup ? "/chat" : "/profile");
        } else {
          toast.error(response.data?.error || "Login failed!");
        }
      } catch (error) {
        console.error("Login error: ", error);
        toast.error("An error occurred during login!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle signup
  const handleSignup = async () => {
    if (validateSignup()) {
      setLoading(true);
      try {
        const response = await apiclient.post(SIGNUP_ROUTE, { email: form.email, password: form.password }, { withCredentials: true });
        if (response.status === 201) {
          toast.success("Signup successful!");
          setForm({ email: "", password: "", confirm: "" }); // ✅ Reset form
          navigate("/profile");
        } else {
          toast.error(response.data?.error || "Signup failed!");
        }
      } catch (error) {
        console.error("Signup error: ", error);
        toast.error("An error occurred during signup!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center">
      <div className="flex justify-center items-center">
        <div className="h-auto w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[40vw] bg-white text-opacity-90 shadow-2xl rounded-3xl flex flex-col items-center justify-center p-8 gap-6">
          {/* Welcome Section */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory" className="w-16 md:w-24" />
            </div>
            <p className="font-medium text-gray-600">Fill in the details to get started with the best chat app</p>
          </div>

          {/* Tabs Section */}
          <Tabs className="w-3/4" defaultValue="login">
            <TabsList className="bg-transparent rounded-none w-full flex border-b">
              <TabsTrigger value="login" className="w-full text-black text-opacity-90 border-b-2 rounded-none p-3 transition-all duration-300 data-[state=active]:font-semibold data-[state=active]:border-b-purple-500">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-full text-black text-opacity-90 border-b-2 rounded-none p-3 transition-all duration-300 data-[state=active]:font-semibold data-[state=active]:border-b-purple-500">
                SignUp
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="flex flex-col mt-10 gap-5">
              <p className="text-gray-600">Enter your login details below:</p>
              <Input type="email" name="email" placeholder="Email" value={form.email} className="rounded-full p-4" onChange={handleChange} />
              <Input type="password" name="password" placeholder="Password" value={form.password} className="rounded-full p-4" onChange={handleChange} />
              <Button className="rounded-full p-4" onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="flex flex-col gap-5">
              <p className="text-gray-600">Create a new account:</p>
              <Input type="email" name="email" placeholder="Email" value={form.email} className="rounded-full p-4" onChange={handleChange} />
              <Input type="password" name="password" placeholder="Password" value={form.password} className="rounded-full p-4" onChange={handleChange} />
              <Input type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} className="rounded-full p-4" onChange={handleChange} />
              <Button className="rounded-full p-4" onClick={handleSignup} disabled={loading}>
                {loading ? "Signing up..." : "SignUp"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Background Image */}
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
