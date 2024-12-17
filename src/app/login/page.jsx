import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "./login-form"
import Logo from "@/components/logo";
export default function LoginPage() {
  return (
    (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:py-2 md:px-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
        </a>
        <LoginForm />
      </div>
    </div>)
  );
}
