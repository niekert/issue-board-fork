import React, {FC, Suspense, useCallback} from 'react';
import {useSwitch} from '@huse/boolean';
import {Select} from 'antd';
import {atom, useRecoilValue} from 'recoil';
import styled from 'styled-components';
import issueService from '../../../api/issue';
import {issueBaseStore, issueStatusStore} from '../../../entities';
import {IssueStatus} from '../../../entities/issueStatus';

const statusState = atom({key: 'issue/status/all', default: issueService.listStatus()});

const Square = styled.i`
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 10px;
`;

const Label = styled.span`
    display: inline-block;
    width: 160px;
    padding: 4px 0;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
`;

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
}

const StatusSelect: FC<SelectProps> = ({value, onChange}) => {
    const options = useRecoilValue(statusState);
    const renderOption = (status: IssueStatus) => (
        <Select.Option id={status.id} value={status.id}>
            <Square style={{backgroundColor: status.color}} />
            {status.name}
        </Select.Option>
    );

    return (
        <Select defaultOpen style={{width: 160}} value={value} onChange={onChange}>
            {options.map(renderOption)}
        </Select>
    );
};

interface Props {
    id: string;
}

const StatusField: FC<Props> = ({id}) => {
    const issue = issueBaseStore.useEntityValue(id);
    const updateIssue = issueBaseStore.usePatchEntity(id);
    const status = issueStatusStore.useEntityValue(issue.status);
    const [editing, startEdit, endEdit] = useSwitch();
    const label = (
        <Label style={{backgroundColor: status.color}} onClick={startEdit}>
            {status.name}
        </Label>
    );
    const submitStatus = useCallback(
        (status: string) => {
            updateIssue({status});
            issueService.patch(id, {status});
            endEdit();
        },
        [id, endEdit, updateIssue]
    );

    return (
        <div style={{gridArea: 'status'}}>
            <span style={{marginRight: 15}}>Status:</span>
            {editing ? (
                <Suspense fallback={label}>
                    <StatusSelect value={status.id} onChange={submitStatus} />
                </Suspense>
            ) : (
                label
            )}
        </div>
    );
};

export default StatusField;
