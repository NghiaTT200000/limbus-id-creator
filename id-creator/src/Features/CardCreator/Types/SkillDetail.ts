import { ICustomEffect } from "./Skills/CustomEffect/ICustomEffect"
import { IDefenseSkill } from "./Skills/DefenseSkill/IDefenseSkill"
import { IMentalEffect } from "./Skills/MentalEffect/IMentalEffect"
import { IOffenseSkill } from "./Skills/OffenseSkill/IOffenseSkill"
import { IPassiveSkill } from "./Skills/PassiveSkill/IPassiveSkill"

export type SkillDetail = IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect
