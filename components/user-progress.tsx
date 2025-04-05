"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { courses } from '@/db/schema';
import { InfinityIcon } from 'lucide-react';
import { useTheme } from "next-themes";
import { SunIcon,MoonIcon } from "lucide-react";
type Props={
    activeCourse:typeof courses.$inferSelect;
    hearts:number;
    points:number;
    hasActiveSubscription:boolean;
};

export const UserProgress=({activeCourse,points,hearts,hasActiveSubscription}:Props)=>{
    const {theme,setTheme}=useTheme();
    return(
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href="/courses">
            <Button variant="ghost">
                <Image
                src={activeCourse.imageSrc}
                alt={activeCourse.title}
                className="rounded-md"
                width={32}
                height={32}
                />
            </Button>
            </Link>
            <Link href="/shop">
            <Button variant="ghost" className='text-orange-500'>
                <Image src="/points.svg" alt="points" height={28} width={28} className='mr-2'/>
                {points}
            </Button>
            </Link>
            <Link href="/shop">
            <Button variant="ghost" className='text-rose-500'>
                <Image src="/heart.svg" alt="hearts" height={22} width={22} className='mr-2'/>
                {hasActiveSubscription ? <InfinityIcon className='h-4 w-4 stroke-[3]'/> : hearts}
            </Button>
            </Link>
            <Button
                onClick={()=>setTheme(theme==="light"?"dark":"light")}
                className="w-10"
                >
                    {theme==="light"?<MoonIcon/>:<SunIcon/>}
                </Button>
        </div>
    )
}