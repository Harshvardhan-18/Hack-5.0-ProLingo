import { Button } from "@/components/ui/button";
import  Image  from "next/image";
export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2 ">
            <div className="max-w-screen-lg mx-auto flex justify-evenly h-full items-center">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/C.png" alt="C" height={32} width={40} className="mr-4 rounded-md"/>
                    C
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/C++.svg" alt="C" height={32} width={40} className="mr-4 rounded-md"/>
                    C++
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/python.svg" alt="C" height={32} width={50} className="mr-4 rounded-md"/>
                    Python
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/JS.svg" alt="C" height={32} width={40} className="mr-4 rounded-md"/>
                    Javascript
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/java.png" alt="C" height={32} width={40} className="mr-4 rounded-md"/>
                    Java
                </Button>

        </div>
        </footer>
    );
};