import faker from 'faker';
import {random, times} from 'lodash';
import {IssueBase} from '../entities/issueBase';
import users from './user';
import statuses from './issueStatus';

function randomPick<T>(array: T[]): T {
    const index = random(0, array.length - 1);
    return array[index];
}

const create = (): IssueBase => {
    return {
        id: faker.random.uuid(),
        creator: randomPick(users).id,
        createdTime: faker.date.recent(30).toISOString(),
        status: randomPick(statuses).id,
        title: faker.lorem.sentence(),
    };
};

export default times(250, create);
