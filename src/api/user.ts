import users from '../mock/user';
import {User} from '../entities/user';

const timeout = (time: number) => new Promise((r) => setTimeout(r, time));

export default {
    async search(keyword: string): Promise<User[]> {
        await timeout(150);
        const selected = users.filter((u) => u.name.toLowerCase().includes(keyword.toLowerCase()));
        return selected;
    },
};
