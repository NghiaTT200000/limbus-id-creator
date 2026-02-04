import { IActiveSkill } from "Features/CardCreator/Types/Skills/ActiveSkill/IActiveSkill";
import IUID from "Types/IUID";
import uuid from "react-uuid";

export interface IDefenseSkill extends IActiveSkill,IUID{
    defenseType:string,
    damageType:string,
    skillAmt: number,
    skillLevel:number,
    atkWeight: number,
}

export class DefenseSkill implements IDefenseSkill, IUID{
    skillLevel: number=0;
    skillAmt: number=1;
    atkWeight: number=1;
    inputId: string=uuid();
    defenseType: string = "Block";
    damageType: string = "Slash";//For counter skill
    name: string = "";
    skillAffinity: string = "Wrath";
    basePower: number = 0;
    coinNo: number = 1;
    coinPow: number = 0;
    skillImage: string = "";
    skillEffect: string="";
    skillLabel: string = "Defense";
    type: string = "DefenseSkill";
    public constructor(name?:string){
        this.name=(name)?name:""
    }
}