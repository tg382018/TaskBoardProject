import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import client from "@/app/api/client";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";
import { Label } from "@packages/ui";
import { useToast } from "@/app/hooks/use-toast";
import OtpForm from "../components/OtpForm";

// Yup validation schema
const loginSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function LoginPage() {
    const [step, setStep] = useState("login"); // 'login' | 'otp'
    const { toast } = useToast();

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const res = await client.post("/auth/login", data);
            return res.data;
        },
        onSuccess: () => {
            setStep("otp");
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: err.response?.data?.message || "Invalid email or password",
            });
        },
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            loginMutation.mutate(values);
        },
    });

    if (step === "otp") {
        return <OtpForm email={formik.values.email} onBack={() => setStep("login")} />;
    }

    return (
        <div className="space-y-6">
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="name@example.com"
                        className={
                            formik.touched.email && formik.errors.email ? "border-destructive" : ""
                        }
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-destructive">{formik.errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                            formik.touched.password && formik.errors.password
                                ? "border-destructive"
                                : ""
                        }
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-xs text-destructive">{formik.errors.password}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending || !formik.isValid}
                >
                    {loginMutation.isPending ? "Sending OTP..." : "Continue"}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground mr-1">Don't have an account?</span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground">
                <span className="bg-card px-2">Powered by TaskBoard</span>
            </div>
        </div>
    );
}
