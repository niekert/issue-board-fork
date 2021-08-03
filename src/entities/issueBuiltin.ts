import {createEntityStore} from './store';

export interface IssueBuiltin {
    id: string;
    content: string;
}

export default createEntityStore<IssueBuiltin>('issueBultin');
