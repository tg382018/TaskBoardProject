import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import client from "@/app/api/client";
import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";
import { Label } from "@packages/ui";
import { useToast } from "@/app/hooks/use-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function OtpForm({ email, onBack }) {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [attemptsLeft, setAttemptsLeft] = useState(5);

    const { toast } = useToast();
    const { setAuth } = useAuth();

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Development-only: Fetch OTP from stub provider and show in console
    useEffect(() => {
        const fetchDevOtp = async () => {
            try {
                const res = await client.get(`/auth/dev/otp/${encodeURIComponent(email)}`);
                if (res.data?.code) {
                    console.log(
                        "%c📧 1 New Notification on Stub Mail Service",
                        "background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
                    );
                    console.log(
                        `%cYour code is: ${res.data.code}`,
                        "color: #2196F3; font-size: 16px; font-weight: bold;"
                    );
                }
            } catch (err) {
                // Silently ignore - this is a dev-only feature
            }
        };

        // Small delay to ensure worker has processed the event
        const timeout = setTimeout(fetchDevOtp, 500);
        return () => clearTimeout(timeout);
    }, [email]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const verifyMutation = useMutation({
        mutationFn: async (otpCode) => {
            const res = await client.post("/auth/verify", { email, code: otpCode });
            return res.data;
        },
        onSuccess: (data) => {
            setAuth(data);
        },
        onError: (err) => {
            setAttemptsLeft((prev) => Math.max(0, prev - 1));
            toast({
                variant: "destructive",
                title: "Verification failed",
                description: err.response?.data?.message || "Invalid OTP code",
            });
        },
    });

    const resendMutation = useMutation({
        mutationFn: async () => {
            const res = await client.post("/auth/resend", { email });
            return res.data;
        },
        onSuccess: () => {
            setTimeLeft(300);
            setAttemptsLeft(5);
            setCode("");
            toast({
                title: "Code sent",
                description: "A new verification code has been sent to your email.",
            });
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Failed to resend code",
                description: err.response?.data?.message || "Could not resend OTP",
            });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length === 6 && timeLeft > 0 && attemptsLeft > 0) {
            verifyMutation.mutate(code);
        }
    };

    const handleResend = () => {
        resendMutation.mutate();
    };

    const isInputDisabled = timeLeft <= 0 || attemptsLeft <= 0;

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                type="button"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change email
            </button>

            <div className="space-y-2">
                <h3 className="text-lg font-medium">Verification Code</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-foreground">{email}</span>
                </p>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="font-medium">
                    {timeLeft > 0 ? (
                        <span className={timeLeft < 60 ? "text-red-500" : "text-primary"}>
                            Expires in: {formatTime(timeLeft)}
                        </span>
                    ) : (
                        <span className="text-destructive font-semibold">Code expired</span>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    {attemptsLeft > 0 ? (
                        <span>{attemptsLeft} attempts remaining</span>
                    ) : (
                        <span className="text-destructive font-semibold">No attempts left</span>
                    )}
                </div>
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
                        disabled={isInputDisabled || verifyMutation.isPending}
                        placeholder="123456"
                        className="text-center text-2xl tracking-[0.5em] font-mono h-12"
                    />
                </div>

                {isInputDisabled && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-500">
                        {timeLeft <= 0
                            ? "Verification code has expired. Please request a new one."
                            : "You have exceeded the maximum number of attempts. Please request a new code."}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={verifyMutation.isPending || isInputDisabled || code.length !== 6}
                >
                    {verifyMutation.isPending ? "Verifying..." : "Verify & Login"}
                </Button>

                {(timeLeft <= 0 || attemptsLeft <= 0) && (
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleResend}
                        disabled={resendMutation.isPending}
                    >
                        {resendMutation.isPending ? (
                            "Sending..."
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Resend Verification Code
                            </>
                        )}
                    </Button>
                )}
            </form>
        </div>
    );
}
