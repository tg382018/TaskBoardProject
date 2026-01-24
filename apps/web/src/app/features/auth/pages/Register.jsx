import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import client from "@/app/api/client";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";
import { Label } from "@packages/ui";
import { useToast } from "@/app/hooks/use-toast";

// Yup validation schema
const registerSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const registerMutation = useMutation({
        mutationFn: async (data) => {
            const res = await client.post("/auth/register", data);
            return res.data;
        },
        onSuccess: () => {
            toast({
                title: "Registration successful!",
                description: "Please login with your new account credentials.",
            });
            navigate("/login");
        },
        onError: (err) => {
            let description =
                err.response?.data?.message || "Something went wrong. Please try again.";

            // Handle AJV validation errors
            if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
                description = err.response.data.details
                    .map((detail) => {
                        const field = detail.path.replace("/", "");
                        return `${field.charAt(0).toUpperCase() + field.slice(1)} ${detail.message}`;
                    })
                    .join(". ");
            }

            toast({
                variant: "destructive",
                title: "Registration failed",
                description: description,
            });
        },
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: registerSchema,
        onSubmit: (values) => {
            registerMutation.mutate(values);
        },
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your details below to create your account
                </p>
            </div>

            <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                            formik.touched.name && formik.errors.name ? "border-destructive" : ""
                        }
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-destructive">{formik.errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                    disabled={registerMutation.isPending || !formik.isValid}
                >
                    {registerMutation.isPending ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground mr-1">Already have an account?</span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </div>
    );
}
