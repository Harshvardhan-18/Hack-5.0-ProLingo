import {create} from "zustand";

type HeartsModalState={
    isOpen:boolean;
    topic?: string;
    open:()=>void;
    close:()=>void;
}
export const useHeartsModal=create <HeartsModalState>((set)=>({
    isOpen:false,
    topic: undefined,
    open:()=>set({isOpen:true}),
    close:()=>set({isOpen:false}),
}))