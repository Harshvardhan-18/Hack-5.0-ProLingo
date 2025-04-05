"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {  useEffect,useState } from "react"
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogFooter,DialogTitle } from "../ui/dialog"
import { Button} from "../ui/button"
import { useHeartsModal } from "@/store/use-hearts-modal"
import {useParams} from "next/navigation"

export const HeartsModal = () => {
    const params=useParams();
    const lessonId=params.lessonId as string;
    const router=useRouter();
    const [isClient,setIsClient]=useState(false);
    const {isOpen,close}=useHeartsModal();
    
    useEffect(()=>setIsClient(true),[]);

    const lessonIdToUrl: Record<string, string> = {
        "8": "https://www.geeksforgeeks.org/cpp-programming-intro/?ref=lbp",
        "9": "https://www.geeksforgeeks.org/cpp-data-types/?ref=lbp",
        "10": "https://www.geeksforgeeks.org/operators-in-cpp/?ref=lbp",
        "11": "https://www.geeksforgeeks.org/decision-making-c-cpp/?ref=lbp",
        "12": "https://www.geeksforgeeks.org/functions-in-cpp/?ref=lbp",
        "13": "https://www.geeksforgeeks.org/pointers-in-c-and-cpp/",
        
      };

      const handleLearnMore = () => {
        close();

        const url = lessonIdToUrl[lessonId]|| `https://www.geeksforgeeks.org/?s=${encodeURIComponent(lessonId)}`;
        window.open(url, "_blank");
      };
      

    const onClick=()=>{
        close();
        router.push("/store");
    };

    if(!isClient){
        return null;
    }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <div className="flex items-center w-full justify-center mb-5">
                    <Image alt="Mascot Bad" src="/mascot_bad.svg" height={80} width={80}/>
                </div>
                <DialogTitle className="text-center font-bold text-2xl">
                    You ran out of hearts!
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                    Get Pro for unlimited hearts, or purchases them in the store.
                </DialogDescription>
                
            </DialogHeader>
            <DialogFooter className="mb-4">
                <div className="flex flex-col gap-y-4 w-full">
                    <Button variant="primary" className="w-full" size="lg"
                    onClick={onClick}>
                        Get unlimited hearts
                    </Button>
                    <Button variant="danger" className="w-full" size="lg"
                    onClick={()=>{
                        close();
                        router.push("/learn")
                    }}>
                        End Session
                    </Button>
                    <Button variant="primaryOutline" className="w-full" size="lg"
                    onClick={
                        handleLearnMore}>
                        Learn More
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

