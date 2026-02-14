import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEgoInfo, EgoInfo } from 'Features/CardCreator/Types/IEgoInfo'
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill'

interface EgoInfoState {
    value: IEgoInfo
}

function hydratePassiveSkills(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "PassiveSkill") {
            return { ...new PassiveSkill(), ...skill }
        }
        return skill
    })
    return hydrated
}

function fixBackwardCompatPaths(info: IEgoInfo): IEgoInfo {
    const fixed = { ...info }
    const oldSinnerIconPath = fixed.sinnerIcon.startsWith("Images")
    const sinnerIconPng = (fixed.sinnerIcon.startsWith("Images") || fixed.sinnerIcon.startsWith("/Images")) && fixed.sinnerIcon.endsWith(".png")

    if (oldSinnerIconPath) fixed.sinnerIcon = "/" + fixed.sinnerIcon
    if (sinnerIconPng) fixed.sinnerIcon = fixed.sinnerIcon.replace(/\.png$/, ".webp")

    return fixed
}

const initialState: EgoInfoState = {
    value: new EgoInfo(),
}

const EgoInfoSlice = createSlice({
    name: 'egoInfo',
    initialState,
    reducers: {
        setEgoInfo(state, action: PayloadAction<IEgoInfo>) {
            state.value = fixBackwardCompatPaths(hydratePassiveSkills(action.payload))
        },
        updateEgoInfoField(state, action: PayloadAction<{ field: string, value: any }>) {
            (state.value as any)[action.payload.field] = action.payload.value
        },
        resetEgoInfo(state) {
            state.value = new EgoInfo()
        },
        setEgoInfoSkillDetails(state, action: PayloadAction<IEgoInfo['skillDetails']>) {
            state.value.skillDetails = action.payload
        },
    },
})

export const {
    setEgoInfo,
    updateEgoInfoField,
    resetEgoInfo,
    setEgoInfoSkillDetails,
} = EgoInfoSlice.actions

export const EgoInfoReducer = EgoInfoSlice.reducer
