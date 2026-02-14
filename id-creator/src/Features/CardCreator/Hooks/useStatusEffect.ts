import { useMemo } from 'react'
import { baseStatusEffect } from 'Features/CardCreator/Utils/BaseStatusEffect'
import { ICustomEffect } from 'Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect'
import { IDefenseSkill } from 'Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill'
import { IMentalEffect } from 'Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect'
import { IOffenseSkill } from 'Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill'
import { IPassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill'
import { ICustomKeyword } from 'Features/CardCreator/Types/ICustomKeyword'

type SkillDetail = IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never

function addNewStatusEffect(customEffect: ICustomEffect): string {
    return `<span class='center-element' contenteditable='false' style='${customEffect.effectColor ? `color:${customEffect.effectColor};` : ''}text-decoration:underline;'>${customEffect.customImg ? `<img class='status-icon' src='${customEffect.customImg}' alt='custom_icon' />` : ''}${customEffect.name}</span>`
}

export function useStatusEffect(skillDetails: SkillDetail[]): { [key: string]: string } {
    const skillCustomEffects = useMemo(() => {
        const statusObj: { [key: string]: string } = {}
        skillDetails.forEach((skill) => {
            if (skill.type === "CustomEffect") {
                const customEffect = skill as ICustomEffect
                if (customEffect.name) {
                    statusObj[customEffect.name.replace(/\s/g, "_").toLowerCase()] = addNewStatusEffect(customEffect)
                }
            }
        })
        return statusObj
    }, [JSON.stringify(skillDetails)])

    const localCustomKeywords = useMemo(() => {
        const customKeywordString = localStorage.getItem("customKeywords")
        if (customKeywordString) {
            const customKeywords = JSON.parse(customKeywordString)
            const statusObj: { [key: string]: string } = {}
            customKeywords.forEach((keyword: ICustomKeyword) => {
                statusObj[keyword.keyword.replace(/\s/g, "_").toLowerCase()] =
                    `<span class='center-element' contenteditable='false' style='color:${keyword.color}'>${keyword.keyword}</span>`
            })
            return statusObj
        }
        return {}
    }, [localStorage.getItem("customKeywords")])

    const statusEffect = useMemo(() => {
        return { ...baseStatusEffect, ...skillCustomEffects, ...localCustomKeywords }
    }, [skillCustomEffects, localCustomKeywords])

    return statusEffect
}
