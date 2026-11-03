export type AppointmentState = {
  status:"idle"|"success"|"error";
  notice?:string;
  nonce?:string;
  week?:string;
  conflict?:boolean;
};
export const initialAppointmentState: AppointmentState = {status:"idle"};
