import {createEntityStore} from './store';

export interface IssueBase {
    id: string;
    title: string;
    status: string;
    creator: string;
    createdTime: string;
}

export default createEntityStore<IssueBase>('issueBase');
