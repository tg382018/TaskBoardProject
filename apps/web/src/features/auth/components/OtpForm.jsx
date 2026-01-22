import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function OtpForm({ email, onBack }) {
    const [code, setCode] = useState("");
    const { setAuth } = useAuthStore();

    const verifyMutation = useMutation({
        mutationFn: async (otpCode) => {
            const res = await client.post("/auth/verify", { email, code: otpCode });
            return res.data;
        },
        onSuccess: (data) => {
            setAuth(data); // Save user and tokens to store
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Invalid OTP code");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length === 6) {
            verifyMutation.mutate(code);
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change email
            </button>

            <div className="space-y-2">
                <h3 className="text-lg font-medium">Verification Code</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        required
                        placeholder="123456"
                        className="text-center text-2xl tracking-[0.5em] font-mono h-12"
                    />
                </div>

                <Button type="submit" className="w-full" disabled={verifyMutation.isPending || code.length !== 6}>
                    {verifyMutation.isPending ? "Verifying..." : "Verify & Login"}
                </Button>
            </form>
        </div>
    );
}
