import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | Desa Mata Mamplam - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page Desa Mata Mamplam Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
