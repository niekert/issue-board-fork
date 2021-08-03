import userStore from './user';
import issueBaseStore from './issueBase';
import issueStatusStore from './issueStatus';
import issueBuiltinStore from './issueBuiltin';
import {useBatchPut as useBatchPutWithMapping} from './store';

export {userStore, issueBaseStore, issueStatusStore, issueBuiltinStore};

export const storeMapping = {
    user: userStore,
    issueBase: issueBaseStore,
    issueStatus: issueStatusStore,
    issueBuiltin: issueBuiltinStore,
};

export const useBatchPut = () => useBatchPutWithMapping(storeMapping);
