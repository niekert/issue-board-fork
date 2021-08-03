import React, {FC, useEffect, useState} from 'react';
import {Drawer, Spin} from 'antd';
import styled from 'styled-components';
import {useActionPending} from '@huse/action-pending';
import issueService from '../../../api/issue';
import {useBatchPut} from '../../../entities';
import TitleField from './TitleField';
import StatusField from './StatusField';
import CreatorField from './CreatorField';
import ContentField from './ContentField';

interface Props {
    id: string;
    onClose: () => void;
}

const Layout = styled.div`
    display: grid;
    grid-row-gap: 20px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 32px 30px 1fr;
    grid-template-areas:
        'title title'
        'status creator'
        'content content';
    align-items: center;
`;

const IssueViewAndEdit: FC<Props> = ({id, onClose}) => {
    const batchPut = useBatchPut();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        (async () => {
            const issue = await issueService.findByID(id);
            const entities = {
                issueBase: {
                    [issue.id]: {
                        ...issue,
                        creator: issue.creator.id,
                        status: issue.status.id,
                    },
                },
                user: {
                    [issue.creator.id]: issue.creator,
                },
                issueStatus: {
                    [issue.status.id]: issue.status,
                },
                issueBuiltin: {
                    [issue.id]: {
                        content: issue.content,
                    },
                },
            };
            batchPut(entities);
            setLoaded(true);
        })();
    }, [id, batchPut]);

    return (
        <Drawer visible width="60vw" title="Issue Detail" onClose={onClose}>
            <Spin spinning={!loaded}>
                <Layout>
                    {loaded && (
                        <>
                            <TitleField id={id} />
                            <StatusField id={id} />
                            <CreatorField id={id} />
                            <ContentField id={id} />
                        </>
                    )}
                </Layout>
            </Spin>
        </Drawer>
    );
};

export default IssueViewAndEdit;
