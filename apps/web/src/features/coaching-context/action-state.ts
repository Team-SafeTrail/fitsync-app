export type ContextState={status:"idle"|"success"|"error";notice?:string;nonce?:string;conflict?:boolean};
export const initialContextState:ContextState={status:"idle"};
