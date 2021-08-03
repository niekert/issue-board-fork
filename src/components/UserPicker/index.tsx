import React, {FC, useCallback, useState} from 'react';
import {Select} from 'antd';
import {keyBy} from 'lodash';
import userService from '../../api/user';
import {useBatchPut} from '../../entities';
import {User} from '../../entities/user';

interface Props {
    current: User;
    onChange: (value: string) => void;
}

const UserPicker: FC<Props> = ({current, onChange}) => {
    const [users, setUsers] = useState<User[]>([]);
    const batchPut = useBatchPut();
    const search = useCallback(
        async (keyword: string) => {
            if (!keyword) {
                return;
            }

            const users = await userService.search(keyword);
            batchPut({user: keyBy(users, (u) => u.id)});
            setUsers(users);
        },
        [batchPut]
    );
    const renderOption = (user: User) => (
        <Select.Option key={user.id} value={user.id}>
            {user.name} ({user.department})
        </Select.Option>
    );

    return (
        <Select
            showSearch
            defaultOpen
            style={{width: 260}}
            filterOption={false}
            value={current.id}
            onSearch={search}
            onSelect={onChange}
        >
            {[current, ...users.filter((u) => u.id !== current.id)].map(renderOption)}
        </Select>
    );
};

export default UserPicker;
