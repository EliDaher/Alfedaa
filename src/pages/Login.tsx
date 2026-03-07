// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import userLogin from "@/services/auth";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // هذا يمنع إعادة تحميل الصفحة

    try {
      const res = await axios.post(
        "https://paynet-main-nasar.onrender.com/api/login",
        {
          email: "nasar",
          password: "Nn123123",
        },
      );

      const res2 = await userLogin({ username, password });

      if (res2?.message.includes("successful")) {
        localStorage.setItem("DaherUser", JSON.stringify(res2.user));
        if (res2.user.role == "employee") {
          navigate("/invoices");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log(res2);
        alert(res2?.error || "فشل تسجيل الدخول");
      }

      const token = res.data.token;
      localStorage.setItem("token", token);
    } catch (err: any) {
      console.log(err.response?.data?.message || "حدث خطأ ما. حاول مرة أخرى.");
      alert("حدث خطأ ما. حاول مرة أخرى.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="new-username"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
