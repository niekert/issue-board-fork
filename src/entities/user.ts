import {createEntityStore} from './store';

export interface User {
    id: string;
    name: string;
    email: string;
    department: string;
}

export default createEntityStore<User>('user');
