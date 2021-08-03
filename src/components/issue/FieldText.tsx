import React, {FC, HTMLAttributes, memo} from 'react';
import {issueBaseStore} from '../../entities';
import {IssueBase} from '../../entities/issueBase';

interface Props extends HTMLAttributes<HTMLSpanElement> {
    id: string;
    field: keyof IssueBase;
    format?: 'text' | 'time';
}

const formatters = {
    text: (input: string) => input,
    time: (input: string) => new Date(input).toLocaleString(),
};

const IssueFieldText: FC<Props> = ({id, field, format = 'text', ...props}) => {
    const issue = issueBaseStore.useEntityValue(id);

    return <span {...props}>{formatters[format](issue[field].toString())}</span>;
};

export default memo(IssueFieldText);
