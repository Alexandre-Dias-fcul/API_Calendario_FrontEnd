import { personalContactDetail } from "./personalContactDetail"
import { personalContactWithDetail } from "./personalContactWithDetail"

export interface agentPersonalContact {
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
    role: number,
    supervisorId: number | null,
    isActive: boolean,
    personalContacts: personalContactWithDetail[]
} 