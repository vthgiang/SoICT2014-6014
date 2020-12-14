import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../auth/redux/actions';
import './intro.css';

const Signup = ({ translate }) => {

    return (
        <section id="dx-service-signup" className="dx-container">

            <div className="row p-center-h">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <h3 className="text-center">{translate('intro.service_signup.title')}</h3>
                    <ul className="dx-services">
                        {
                            translate('intro.service_signup.content').map(content => (
                                <li className="dx-service-item">
                                    <i className="fa fa-check"></i>
                                    {content}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <form class="dx-service">
                        <input placeholder={translate('intro.service_signup.form.customer')}></input>
                        <input placeholder={translate('intro.service_signup.form.email')}></input>
                        <input placeholder={translate('intro.service_signup.form.phone')}></input>
                        <select>
                            <option>{translate('intro.service_signup.form.type.choose')}</option>
                            <option>{translate('intro.service_signup.form.type.standard')}</option>
                            <option>{translate('intro.service_signup.form.type.full')}</option>
                        </select>
                        <button className="send">{translate('intro.service_signup.form.send')}</button>
                    </form>
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

export default connect(mapState, mapDispatchToProps)(withTranslate(Signup));