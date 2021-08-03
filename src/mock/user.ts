import faker from 'faker';
import {times} from 'lodash';
import {User} from '../entities/user';

const create = (): User => {
    return {
        id: faker.random.uuid(),
        name: `${faker.name.lastName()} ${faker.name.firstName()}`,
        email: faker.internet.email(),
        department: faker.commerce.department(),
    };
};

export default times(100, create);
