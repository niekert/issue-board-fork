import React, {FC, useCallback, useState} from 'react';
import {useSwitch} from '@huse/boolean';
import {Input} from 'antd';
import issueService from '../../../api/issue';
import EditTrigger from '../../EditTrigger';
import {issueBaseStore} from '../../../entities';

interface Props {
    id: string;
}

const TitleField: FC<Props> = ({id}) => {
    const title = issueBaseStore.useEntityProperty(id, 'title');
    const updateIssue = issueBaseStore.usePatchEntity(id);
    const [editing, startEdit, endEdit] = useSwitch();
    const [newTitle, setNewTitle] = useState(title);
    const submitNewTitle = useCallback(() => {
        updateIssue({title: newTitle});
        issueService.patch(id, {title: newTitle});
        endEdit();
    }, [id, newTitle, endEdit, updateIssue]);

    return (
        <div style={{height: 32, display: 'flex', alignItems: 'center', gridArea: 'title'}}>
            {editing ? (
                <Input
                    style={{marginRight: 40}}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={submitNewTitle}
                />
            ) : (
                <>
                    <div style={{fontSize: 18}}>{title}</div>
                    <EditTrigger onClick={startEdit} />
                </>
            )}
        </div>
    );
};

export default TitleField;
