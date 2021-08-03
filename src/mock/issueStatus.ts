import {IssueStatus} from '../entities/issueStatus';

const database: IssueStatus[] = [
    {id: '1', name: 'New', color: '#989898'},
    {id: '2', name: 'Assigned', color: '#78cc52'},
    {id: '3', name: 'In Progress', color: '#dbae03'},
    {id: '4', name: 'Completed', color: '#5c6c9b'},
    {id: '5', name: 'Abandoned', color: '#cc5256'},
];

export default database;
