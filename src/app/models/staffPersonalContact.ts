import { personalContactWithDetail } from "./personalContactWithDetail"

export interface staffPersonalContact {
    id: number,
    name: {
        firstName: string,
        middleNames: string[],
        lastName: string
    }
    dateOfBirth: Date | null,
    gender: string,
    hiredDate: Date | null,
    dateOfTermination: Date | null,
    photoFileName: string,
    isActive: boolean,
    personalContacts: personalContactWithDetail[]
} 