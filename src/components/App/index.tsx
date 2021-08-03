import React, {FC, useCallback, useState} from 'react';
import 'antd/dist/antd.min.css';
import IssueTable from '../issue/Table';
import IssueViewAndEdit from '../issue/ViewAndEdit';

const App: FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const closeView = useCallback(() => setSelected(null), []);

    return (
        <>
            <IssueTable onSelect={setSelected} />
            {selected && <IssueViewAndEdit key={selected} id={selected} onClose={closeView} />}
        </>
    );
};

export default App;
