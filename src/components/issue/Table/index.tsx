import React, {FC, useState, useEffect, useMemo, memo, useCallback} from 'react';
import {keyBy} from 'lodash';
import {Table} from 'antd';
import styled from 'styled-components';
import issueAPI, {FulfilledIssueBase} from '../../../api/issue';
import {issueBaseStore, issueStatusStore, useBatchPut, userStore} from '../../../entities';
import {IssueBase} from '../../../entities/issueBase';
import FieldText from '../FieldText';

const TitleLabel = styled.span`
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

interface IssueKey {
    id: string;
}

interface TitleProps extends IssueKey {
    onSelect: (id: string) => void;
}

const TitleField: FC<TitleProps> = ({id, onSelect}) => {
    const issue = issueBaseStore.useEntityValue(id);
    const select = useCallback(() => onSelect(id), [id, onSelect]);

    return <TitleLabel onClick={select}>{issue.title}</TitleLabel>;
};

const MemoedTitleField = memo(TitleField);

const StatusLabel: FC<IssueKey> = ({id}) => {
    const issue = issueBaseStore.useEntityValue(id);
    const status = issueStatusStore.useEntityValue(issue.status);

    return (
        <div
            style={{
                padding: '4px 10px',
                borderRadius: 4,
                width: 100,
                textAlign: 'center',
                color: '#fff',
                backgroundColor: status.color,
            }}
        >
            {status.name}
        </div>
    );
};

const MemoedStatusLabel = memo(StatusLabel);

const CreatorName: FC<IssueKey> = ({id}) => {
    const issue = issueBaseStore.useEntityValue(id);
    const creator = userStore.useEntityValue(issue.creator);

    return <>{creator.name}</>;
};

const MemoedCreatorName = memo(CreatorName);

const toIssueBase = (fulfilled: FulfilledIssueBase): IssueBase => {
    return {
        ...fulfilled,
        creator: fulfilled.creator.id,
        status: fulfilled.status.id,
    };
};

const identity = (id: string) => id;

interface Props {
    onSelect: (id: string) => void;
}

const IssueTable: FC<Props> = ({onSelect}) => {
    const [keys, setKeys] = useState<string[]>([]);
    const batchPut = useBatchPut();
    useEffect(() => {
        (async () => {
            const {results} = await issueAPI.list({offset: 0, limit: 20});
            const entities = {
                issueBase: keyBy(results.map(toIssueBase), (i) => i.id),
                user: keyBy(
                    results.map((i) => i.creator),
                    (u) => u.id
                ),
                issueStatus: keyBy(
                    results.map((i) => i.status),
                    (s) => s.id
                ),
            };
            batchPut(entities);
            setKeys(results.map((i) => i.id));
        })();
    }, [batchPut]);
    const columns = useMemo(
        () => [
            {
                title: 'Title',
                key: 'title',
                render: (id: string) => <MemoedTitleField id={id} onSelect={onSelect} />,
            },
            {
                title: 'Status',
                key: 'status',
                render: (id: string) => <MemoedStatusLabel id={id} />,
            },
            {
                title: 'Created By',
                key: 'creator',
                render: (id: string) => <MemoedCreatorName id={id} />,
            },
            {
                title: 'Created At',
                key: 'creator',
                render: (id: string) => <FieldText id={id} field="createdTime" format="time" />,
            },
        ],
        [onSelect]
    );

    return (
        <Table
            // @ts-ignore
            rowKey={identity}
            // @ts-ignore
            dataSource={keys}
            columns={columns}
            pagination={false}
        />
    );
};

export default IssueTable;
