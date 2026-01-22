import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OtpForm from "../components/OtpForm";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState("login"); // 'login' | 'otp'

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const res = await client.post("/auth/login", data);
            return res.data;
        },
        onSuccess: () => {
            setStep("otp");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Login failed");
        }
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    if (step === "otp") {
        return <OtpForm email={email} onBack={() => setStep("login")} />;
    }

    return (
        <div className="space-y-6">
            <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Sending OTP..." : "Continue with Password"}
                </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
                <span className="bg-card px-2">Powered by TaskBoard</span>
            </div>
        </div>
    );
}
