import IUID from "Interfaces/IUID";
import IEffect from "Interfaces/SkillAndEffect/IEffect";
import uuid from "react-uuid";

export interface IMentalEffect extends IEffect,IUID{
    effect:string
}

export class MentalEffect implements IMentalEffect,IUID{
    inputId: string = uuid()
    effect: string = "";
    type: string = "MentalEffect";
}