import { personalContactDetail } from "./personalContactDetail";
export interface personalContactWithDetail {
    id: number;
    name: string;
    isPrimary: boolean;
    notes: string;
    personalContactDetails: personalContactDetail[];
} 