import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ClerkLoading ,ClerkLoaded,SignedIn,SignedOut,SignInButton,UserButton} from "@clerk/nextjs";

export const Header = () => {
    return(
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image alt="Logo" src="/logo_1.png" width={65} height={65}/>
                    <h1 className="text-3xl  font-extrabold text-sky-600 tracking-wide">Prolingo</h1>

                </div>
            <ClerkLoading>
                <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
            </ClerkLoading>
            <ClerkLoaded>
                <SignedIn>
                <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
                </SignedIn>
                <SignedOut>
                <SignInButton
              mode="modal"

            >
              <Button variant="ghost" size="lg">
                Login
              </Button>
            </SignInButton>
                </SignedOut>
            </ClerkLoaded>
              </div>
        </header>
    );
}; 