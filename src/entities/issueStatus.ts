import {createEntityStore} from './store';

export interface IssueStatus {
    id: string;
    name: string;
    color: string;
}

export default createEntityStore<IssueStatus>('issueStatus');
