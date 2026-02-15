import { useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useCardMode } from 'Features/CardCreator/Contexts/CardModeContext'
import { useAppDispatch, useAppSelector } from 'Stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { deleteIdInfoSkill, updateIdInfoSkill, changeIdInfoSkillType } from 'Features/CardCreator/Stores/IdInfoSlice'
import { deleteEgoInfoSkill, updateEgoInfoSkill, changeEgoInfoSkillType } from 'Features/CardCreator/Stores/EgoInfoSlice'
import { SkillDetail } from 'Features/CardCreator/Types/SkillDetail'
import { OffenseSkill } from 'Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill'
import { DefenseSkill } from 'Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill'
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill'
import { CustomEffect } from 'Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect'
import { MentalEffect } from 'Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect'

function createSkillByType(newType: string): SkillDetail {
    switch (newType) {
        case "OffenseSkill": return new OffenseSkill()
        case "DefenseSkill": return new DefenseSkill()
        case "PassiveSkill": return new PassiveSkill()
        case "CustomEffect": return new CustomEffect()
        case "MentalEffect": return new MentalEffect()
        default: return new OffenseSkill()
    }
}

interface UseSkillFormReturn<T extends SkillDetail> extends UseFormReturn<T> {
    deleteSkill: () => void
    changeSkillType: (newType: string) => void
    skill: T
    keyWordList: { [key: string]: string }
}

export function useSkillForm<T extends SkillDetail>(index: number): UseSkillFormReturn<T> {
    const mode = useCardMode()
    const dispatch = useAppDispatch()

    const skill = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails[index] : state.egoInfo.value.skillDetails[index]
    ) as T

    const keyWordList = useStatusEffect()

    const form = useForm<T>({ defaultValues: structuredClone(skill) as any })

    useEffect(() => { form.reset(structuredClone(skill) as any) }, [skill.inputId])

    useEffect(() => {
        const sub = form.watch((values) => {
            const action = mode === "id" ? updateIdInfoSkill : updateEgoInfoSkill
            dispatch(action({ index, skill: structuredClone(values) as SkillDetail }))
        })
        return () => sub.unsubscribe()
    }, [form.watch, index, mode])

    const deleteSkill = () => dispatch(
        mode === "id" ? deleteIdInfoSkill(skill.inputId) : deleteEgoInfoSkill(skill.inputId)
    )

    const changeSkillType = (newType: string) => {
        const newSkill = createSkillByType(newType)
        dispatch(
            mode === "id"
                ? changeIdInfoSkillType({ index, skill: newSkill })
                : changeEgoInfoSkillType({ index, skill: newSkill })
        )
    }

    return { ...form, deleteSkill, changeSkillType, skill, keyWordList }
}
