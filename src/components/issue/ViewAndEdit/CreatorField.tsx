import {useSwitch} from '@huse/boolean';
import React, {FC, useCallback} from 'react';
import issueService from '../../../api/issue';
import {issueBaseStore, userStore} from '../../../entities';
import EditTrigger from '../../EditTrigger';
import UserPicker from '../../UserPicker';

interface Props {
    id: string;
}

const CreatorField: FC<Props> = ({id}) => {
    const issue = issueBaseStore.useEntityValue(id);
    const creator = userStore.useEntityValue(issue.creator);
    const updateIssue = issueBaseStore.usePatchEntity(id);
    const [editing, startEdit, endEdit] = useSwitch();
    const submitCreator = useCallback(
        (creator: string) => {
            updateIssue({creator});
            issueService.patch(id, {creator});
            endEdit();
        },
        [id, updateIssue, endEdit]
    );

    return (
        <div style={{gridArea: 'creator'}}>
            <span style={{marginRight: 15}}>Created by:</span>
            {editing ? (
                <UserPicker current={creator} onChange={submitCreator} />
            ) : (
                <>
                    {creator.name}
                    <EditTrigger onClick={startEdit} />
                </>
            )}
        </div>
    );
};

export default CreatorField;
