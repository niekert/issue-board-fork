import users from '../mock/user';
import statuses from '../mock/issueStatus';
import bases from '../mock/issueBase';
import builtins from '../mock/issueBuiltin';
import {IssueBase} from '../entities/issueBase';
import {User} from '../entities/user';
import {IssueStatus} from '../entities/issueStatus';
import {IssueBuiltin} from '../entities/issueBuiltin';
import {PageQuery, PageResponse} from './interface';

export interface FulfilledIssueBase extends Omit<IssueBase, 'creator' | 'status'> {
    creator: User;
    status: IssueStatus;
}

const timeout = (time: number) => new Promise((r) => setTimeout(r, time));

function find<T extends {id: string}>(array: T[], id: string) {
    return array.find((i) => i.id === id) as T;
}

const fulfillIssueBase = (input: IssueBase): FulfilledIssueBase => {
    return {
        ...input,
        creator: find(users, input.creator),
        status: find(statuses, input.status),
    };
};

export default {
    async list(page: PageQuery): Promise<PageResponse<FulfilledIssueBase>> {
        await timeout(500);
        const selected = bases.slice(page.offset, page.offset + page.limit);
        return {
            totalCount: bases.length,
            results: selected.map(fulfillIssueBase),
        };
    },
    async findByID(id: string): Promise<FulfilledIssueBase & IssueBuiltin> {
        await timeout(200);
        const base = find(bases, id);
        const builtin = find(builtins, id);
        return {
            ...fulfillIssueBase(base),
            ...builtin,
        };
    },
    async listStatus(): Promise<IssueStatus[]> {
        await timeout(350);
        return statuses;
    },
    async patch(id: string, patch: Partial<IssueBase>): Promise<void> {
        await timeout(500);
        Object.assign(find(bases, id), patch);
    },
};
