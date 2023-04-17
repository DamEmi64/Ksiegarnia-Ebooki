import { PremiumType } from "./premiumType";

export default interface PremiumHistory{
    id: string,
    type: PremiumType,
    fromDate: string,
    toDate: string,
    prize: number
}