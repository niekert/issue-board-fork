import React from 'react';
import {render} from 'react-dom';
import {RecoilRoot} from 'recoil';
import App from './components/App';

const rootElement = document.getElementById('root');
render(
    <RecoilRoot>
        <App />
    </RecoilRoot>,
    rootElement
);
