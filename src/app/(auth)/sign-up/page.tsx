import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-6 md:p-10 min-h-svh">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
