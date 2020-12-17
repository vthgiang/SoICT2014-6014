import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../auth/redux/actions';
import './intro.css';

const Intro = ({ translate }) => {

    return (
        <section id="dx-intro" className="dx-container dx-intro-container">
            <div className="row p-center-h">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <h2 className="dx-sologan text-center">DX - {translate('intro.title')}</h2>
                    <ul className="dx-services">
                        {
                            translate('intro.contents').map(content => (
                                <li className="dx-service-item">
                                    <i className="fa fa-check"></i>
                                    {content}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <img className="dx-intro-image" src='/library/dx/images/image4.png' style={{ borderRadius: '50%' }} />
                </div>
            </div>
        </section>
    )
}

function mapState(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink,
}

export default connect(mapState, mapDispatchToProps)(withTranslate(Intro));