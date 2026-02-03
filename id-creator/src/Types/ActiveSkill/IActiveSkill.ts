import ISkill from "Types/SkillAndEffect/ISkill";

export interface IActiveSkill extends ISkill{
    name:string,
    skillAffinity:string,
    basePower:number,
    coinNo:number,
    coinPow:number,
    skillImage:string,
    skillEffect:string,
    skillLabel:string,
}