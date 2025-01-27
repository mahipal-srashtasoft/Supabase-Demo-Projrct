import React from 'react';
import Navbar from '../Navbar';

const HOC = (WrappedComponent) => {
    return (props) => {
        return (
            <div>
                <Navbar />
                <main className='container'>
                    <WrappedComponent {...props} />
                </main>
            </div>
        );
    };
};

export default HOC;