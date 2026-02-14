import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IIdInfo, IdInfo } from 'Features/CardCreator/Types/IIdInfo'
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill'

interface IdInfoState {
    value: IIdInfo
}

function hydratePassiveSkills(info: IIdInfo): IIdInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "PassiveSkill") {
            return { ...new PassiveSkill(), ...skill }
        }
        return skill
    })
    return hydrated
}

function fixBackwardCompatPaths(info: IIdInfo): IIdInfo {
    const fixed = { ...info }
    const oldSinnerIconPath = fixed.sinnerIcon.startsWith("Images")
    const oldSinnerRarityPath = fixed.rarity.startsWith("Images")
    const sinnerIconPng = (fixed.sinnerIcon.startsWith("Images") || fixed.sinnerIcon.startsWith("/Images")) && fixed.sinnerIcon.endsWith(".png")
    const rarityPng = (fixed.rarity.startsWith("Images") || fixed.rarity.startsWith("/Images")) && fixed.rarity.endsWith(".png")

    if (oldSinnerIconPath) fixed.sinnerIcon = "/" + fixed.sinnerIcon
    if (oldSinnerRarityPath) fixed.rarity = "/" + fixed.rarity
    if (sinnerIconPng) fixed.sinnerIcon = fixed.sinnerIcon.replace(/\.png$/, ".webp")
    if (rarityPng) fixed.rarity = fixed.rarity.replace(/\.png$/, ".webp")

    return fixed
}

function toPlain(info: IIdInfo): IIdInfo {
    return JSON.parse(JSON.stringify(info))
}

const initialState: IdInfoState = {
    value: toPlain(new IdInfo()),
}

const IdInfoSlice = createSlice({
    name: 'idInfo',
    initialState,
    reducers: {
        setIdInfo(state, action: PayloadAction<IIdInfo>) {
            state.value = fixBackwardCompatPaths(hydratePassiveSkills(action.payload))
        },
        updateIdInfoField(state, action: PayloadAction<{ field: string, value: any }>) {
            (state.value as any)[action.payload.field] = action.payload.value
        },
        resetIdInfo(state) {
            state.value = toPlain(new IdInfo())
        },
        setIdInfoSkillDetails(state, action: PayloadAction<IIdInfo['skillDetails']>) {
            state.value.skillDetails = action.payload
        },
    },
})

export const {
    setIdInfo,
    updateIdInfoField,
    resetIdInfo,
    setIdInfoSkillDetails,
} = IdInfoSlice.actions

export const IdInfoReducer = IdInfoSlice.reducer
