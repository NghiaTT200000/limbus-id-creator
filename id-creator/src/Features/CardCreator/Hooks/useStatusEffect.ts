import { useMemo } from 'react'
import { baseStatusEffect } from 'Features/CardCreator/Utils/BaseStatusEffect'
import { ICustomEffect } from 'Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect'
import { ICustomKeyword } from 'Features/CardCreator/Types/ICustomKeyword'
import { useCardMode } from 'Features/CardCreator/Contexts/CardModeContext'
import { useAppSelector } from 'Stores/AppStore'

export function useStatusEffect(): { [key: string]: string } {
    const mode = useCardMode()
    const skillDetails = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails : state.egoInfo.value.skillDetails
    )

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

function addNewStatusEffect(customEffect: ICustomEffect): string {
    return `<span class='center-element' contenteditable='false' style='${customEffect.effectColor ? `color:${customEffect.effectColor};` : ''}text-decoration:underline;'>${customEffect.customImg ? `<img class='status-icon' src='${customEffect.customImg}' alt='custom_icon' />` : ''}${customEffect.name}</span>`
}
