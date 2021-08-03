import React, {FC} from 'react';
import {issueBuiltinStore} from '../../../entities';

interface Props {
    id: string;
}

const ContentField: FC<Props> = ({id}) => {
    const issue = issueBuiltinStore.useEntityValue(id);

    return (
        <div style={{gridArea: 'content', whiteSpace: 'pre-wrap'}}>
            <div style={{marginBottom: 10, fontWeight: 600, fontSize: 14}}>Content</div>
            <div>
                {issue.content.split('\n').map((c, i) => (
                    <p key={i}>{c}</p>
                ))}
            </div>
        </div>
    );
};

export default ContentField;
