import {useCallback} from 'react';
import {atomFamily, RecoilState, selectorFamily, useRecoilCallback, useRecoilValue, useSetRecoilState} from 'recoil';
import {useIntendedLazyValue} from '@huse/intended-lazy';

export interface EntityStore<E> {
    name: string;
    usePutEntity: () => (key: string, entity: E) => void;
    useEntityValue: (key: string) => E;
    useEntityProperty: <P extends keyof E>(key: string, property: P) => E[P];
    useEntityList: (keys: string[]) => E[];
    useSetEntity: (key: string) => (updater: E | ((current: E) => E)) => void;
    usePatchEntity: (key: string) => (patch: Partial<E>) => void;
}

interface StoreInternals {
    family: (key: string) => RecoilState<any>;
}

const UNWRAP_STORE = new Map<string, StoreInternals>();

export function createEntityStore<E>(name: string): EntityStore<E> {
    if (UNWRAP_STORE.has(name)) {
        throw new Error(`Entity store ${name} already defined`);
    }

    const family = atomFamily<E | null, string>({
        key: `entities/${name}`,
        default: null,
    });
    const listSelectorFamily = selectorFamily({
        key: `entities/${name}/list`,
        get: (keys: string[]) => ({get}) => {
            const toEntity = (key: string) => {
                const value = get(family(key));

                if (!value) {
                    throw new Error(`${name} with key ${key} does not present`);
                }

                return value;
            };
            return keys.map(toEntity);
        },
    });
    const propertySelectorFamily = selectorFamily({
        key: `entities/${name}/property`,
        get: ([key, property]: [string, keyof E]) => ({get}) => {
            const entity = get(family(key));

            if (!entity) {
                throw new Error(`${name} with key ${key} does not present`);
            }

            return entity[property];
        },
    });

    UNWRAP_STORE.set(name, {family});

    const usePutEntity = () => {
        const put = useRecoilCallback(
            ({set}) => (key: string, entity: E) => {
                set(family(key), entity);
            },
            []
        );
        return put;
    };
    const useEntityValue = (key: string) => {
        const value = useRecoilValue(family(key));

        if (!value) {
            throw new Error(`${name} with key ${key} does not present`);
        }

        return value;
    };
    const useEntityProperty = <P extends keyof E>(key: string, property: P) => {
        return useRecoilValue(propertySelectorFamily([key, property])) as E[P];
    };
    const useEntityList = (keys: string[]) => useRecoilValue(listSelectorFamily(keys));
    const useSetEntity = (key: string) => {
        const set = useSetRecoilState(family(key));
        const setEntity = useCallback(
            (updater: E | ((current: E) => E)) => {
                const update = (current: E | null) => {
                    if (!current) {
                        throw new Error(`${name} with key ${key} does not present`);
                    }

                    return typeof updater === 'function' ? (updater as any)(current) : updater;
                };
                set(update);
            },
            [key, set]
        );
        return setEntity;
    };
    const usePatchEntity = (key: string) => {
        const set = useSetEntity(key);
        const patch = useCallback(
            (patch: Partial<E>) => {
                const merge = (current: E | null) => {
                    if (!current) {
                        throw new Error(`${name} with key ${key} does not present and cannot be patched`);
                    }

                    return {...current, ...patch};
                };
                set(merge);
            },
            [key, set]
        );
        return patch;
    };

    return {
        name,
        usePutEntity,
        useEntityValue,
        useEntityProperty,
        useEntityList,
        useSetEntity,
        usePatchEntity,
    };
}

type EntityStoreMapping = Record<string, EntityStore<any>>;

type EntityMap<T extends EntityStoreMapping> = {
    [K in keyof T]: T[K] extends EntityStore<infer E> ? Record<string, E> : never;
};

export function useBatchPut<M extends EntityStoreMapping>(storeMapping: M) {
    const readStoreMapping = useIntendedLazyValue(storeMapping);
    const batchPut = useRecoilCallback(
        ({set}) => (entities: Partial<EntityMap<M>>): void => {
            const mapping = readStoreMapping();
            const batchPutEntities = (name: keyof M) => {
                const store = mapping[name];
                const internals = UNWRAP_STORE.get(store.name);
                if (!internals) {
                    throw new Error(`Entity store ${name} is not defined`);
                }
                const records = entities[name] as Record<string, any>;
                Object.keys(records).forEach((k) => set(internals.family(k), records[k]));
            };
            Object.keys(entities).forEach(batchPutEntities);
        },
        [readStoreMapping]
    );
    return batchPut;
}
