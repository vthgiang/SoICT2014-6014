import React from 'react';
import Header from './header';
import Intro from './intro';
import Service from './service';
import Signup from './signUp';
import Location from './location';
import Contact from './contact';
import Footer from './footer';

import './intro.css';

const Introduction = () => {

    return (
        <React.Fragment>
            <Header />
            <Intro />
            <Service />
            <Signup />
            <Location />
            <Contact />
            <Footer />
        </React.Fragment>
    );
}

export { Introduction };