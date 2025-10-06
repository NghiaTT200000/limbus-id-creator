import Dexie, { EntityTable } from 'dexie';
import { IEgoInfo } from 'interfaces/IEgoInfo';
import { IIdInfo } from 'interfaces/IIdInfo';
import { ISaveFile } from 'interfaces/ISaveFile';

interface LocalSaves {
    currIdSave: IIdInfo;
    IdLocalSaves: ISaveFile<IIdInfo>;
    currEgoSave: IIdInfo;
    EgoLocalSaves: ISaveFile<IEgoInfo>;
}

const indexDB = new Dexie("LocalSaves") as Dexie & {
    currIdSave: EntityTable<
        IIdInfo & { localSaveId?: number },
        'localSaveId'>,
    IdLocalSaves: EntityTable<ISaveFile<IIdInfo>, 'id'>,
    currEgoSave: EntityTable<
        IEgoInfo & { localSaveId?: number },
        'localSaveId'>,
    EgoLocalSaves: EntityTable<ISaveFile<IEgoInfo>, 'id'>
};

indexDB.version(1).stores({
    currIdSave: '++localSaveId',
    IdLocalSaves: 'id',
    currEgoSave: '++localSaveId',
    EgoLocalSaves: 'id'
})

export type { LocalSaves };
export { indexDB };