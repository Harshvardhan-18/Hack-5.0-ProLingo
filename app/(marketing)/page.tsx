"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect,useState} from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import Link from "next/link";
import { ClerkLoading, ClerkLoaded, SignedIn,SignInButton, SignedOut,SignUpButton } from "@clerk/nextjs";

interface Logo {
  src: string;
  alt: string;
  x: number;
  y:number;
}

const Home = () => {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const numLogos = 5;
    const radius = 180; 

    const logoData = [
      { src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg", alt: "ReactJS" },
      { src: "/C++.svg", alt: "C++"},
      { src: "/python.svg", alt: "Python" },
      { src: "/JS.svg", alt: "JavaScript" },
      { src: "https://www.vectorlogo.zone/logos/java/java-icon.svg", alt: "Java" }
    ];
    const logosWithPosition = logoData.map((logo, index) => {
      const angle = (index / numLogos) * (2 * Math.PI); 
      return {
        ...logo,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      };
    });

    setLogos(logosWithPosition);
  }, []);

  return (
    <div className="m-w-[988px] mx-auto p-4 gap-2 flex-1 w-full items-center justify-center flex flex-col lg:flex-row">
      <div className=" lg:block hidden relative mb-8 lg:mb-0 w-[240px] h-[240px] lg:w-[424px] lg:h-[424px]">
        {/* <Image src="/hero.svg" fill alt="Hero"/> */}
        <motion.div className="relative w-[300px] h-[300px]" initial={{ y: 120 }} animate={{ y: 140 }} transition={{ duration: 2, ease: "easeInOut" }}>
        {logos.map((logo) => (
          <motion.div
            key={logo.alt}
            className="absolute"
            initial={{ x: logo.x, y: logo.y, opacity: 0 }}
            animate={{
              x: logo.x,
              y: [logo.y, logo.y - 10, logo.y, logo.y + 10, logo.y], // Slight vertical floating
              opacity: 1,
              rotate:[0,10,-10,0]
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity, // Infinite floating effect
              opacity: { duration: 1 }
            }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={20}
              height={20}
              className="w-20 h-20 object-contain"
            />
          </motion.div>
        ))}
      </motion.div>
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-center text-neutral-600 max-w-[480px]">
        Learn practice and master programming languages with Prolingo.
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
            <ClerkLoading>
                <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
            </ClerkLoading>
            <ClerkLoaded>
                <SignedOut>
                    <SignUpButton mode="modal">
                        <Button size="lg" variant="secondary" className="w-full">
                            Get Started
                        </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <Button size="lg" variant="primaryOutline" className="w-full">
                            I already have an account
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Button size="lg" className="w-full" asChild variant="secondary">
                       <Link href="/learn">
                       Continue Learning 
                       </Link>
                    </Button>
                </SignedIn>
            </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};

export default Home;
