import React from 'react';
import { Provider } from 'react-redux';

import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { store } from '../store';

export default function MyApp({ Component, pageProps }) {

    if (Component.getLayout) {
        return (
            <Provider store={store}>
                <LayoutProvider store={store}>
                    {Component.getLayout(<Component {...pageProps} />)}
                </LayoutProvider>
            </Provider>
        )
    } else {
        return (
            <Provider store={store}>
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            </Provider>
        );
    }
}