import { type MotionValue } from "framer-motion";
export type Infer<T> = T extends Array<infer U> ? U : never;
export type Function<T extends Array<any> | void = void,R extends any = void> = T extends any[] ? (...params : T)=> R : ()=> R; 
export type useRelativeMouse = <T extends HTMLElement>(to : React.RefObject<T>)=> Record<"x"|"y", MotionValue<number>>;