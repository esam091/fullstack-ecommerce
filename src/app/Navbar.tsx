import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "@/components/ui/dialog";
import { SignIn, SignOutButton, auth, UserButton } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";

export default async function NavBar() {
  const userId = auth().userId;

  return (
    <header className="flex h-16 items-center border-b border-b-border bg-background px-6 ">
      <span className="flex items-center gap-1 text-primary">
        <ShoppingBag size={32} />
        <span className="text-xl">Happy Commerce</span>
      </span>

      <nav className="ml-auto flex">
        {!userId && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign In</Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent
                showBackground={false}
                className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
              >
                <SignIn />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        )}

        {userId && (
          <>
            <UserButton />
            <Button asChild variant={"ghost"}>
              <SignOutButton />
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
