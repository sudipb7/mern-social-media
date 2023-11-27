import LoginForm from "@/components/forms/LoginForm";
import SignUpForm from "@/components/forms/SignUpForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Auth() {
  return (
    <main className="w-full h-[100dvh] flex justify-center items-center">
      <div className="max-lg:hidden flex justify-center items-center h-full w-2/5 xl:w-1/2 relative p-5">
        <img
          src="/logo.svg"
          alt="X logo"
          width={270}
          height={270}
          className="object-cover dark:invert"
        />
      </div>
      <section className="max-sm:w-[95%] w-3/5 xl:w-1/2 h-full flex flex-col justify-center items-start relative gap-5 p-9">
        <img
          src="/logo.svg"
          alt="X logo"
          width={55}
          height={55}
          className="lg:hidden object-cover dark:invert mb-1"
        />

        <h3 className="max-sm:text-5xl text-7xl font-extrabold mt-5">
          Happening now
        </h3>

        <h4 className="max-sm:text-2xl text-4xl font-bold mt-4 md:mt-5">
          Join today.
        </h4>

        <div className="w-3/4 lg:w-3/5 flex flex-col items-start justify-start gap-3 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full rounded-full font-medium p-5 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white">
                Create Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <SignUpForm />
            </DialogContent>
          </Dialog>
          <p className="w-full text-muted-foreground text-[0.7rem] font-light">
            By signing up, you agree to the{" "}
            <span className="text-[#1A8CD8] cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#1A8CD8] cursor-pointer hover:underline">
              Privacy Policy
            </span>
            , including{" "}
            <span className="text-[#1A8CD8] cursor-pointer hover:underline">
              Cookie Use.
            </span>
          </p>
        </div>

        <div className="w-3/4 lg:w-3/5 flex flex-col items-start justify-start gap-3 mt-6">
          <h6 className="text-xl font-bold">Already have an account?</h6>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-full font-medium p-5 text-[#1D9BF0] hover:text-[#1D9BF0] bg-[#1D9BF0]/5 hover:bg-[#1D9BF0]/10"
              >
                Sign in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <LoginForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
