import faker from 'faker';
import bases from './issueBase';

export default bases.map((b) => ({id: b.id, content: faker.lorem.paragraphs()}));
