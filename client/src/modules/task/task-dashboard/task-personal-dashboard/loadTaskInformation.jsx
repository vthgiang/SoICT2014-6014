import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

const LoadTaskInformation = (props) => {
    const { translate } = props;


    return (
        <li className="dropdown user user-menu">
            <a className="dropdown-toggle" data-toggle="dropdown" style={{ cursor: 'pointer', width: '20px', minHeight: '20px' }}>
                <i className="fa fa-plus" />
            </a>
            <ul className="dropdown-menu" style={{ border: '0.2px solid #d1d1d1' }}>
                {/* User image */}
                <li style={{ backgroundColor: '#343A40' }}>
                    <img alt="load-task-information" src="image/loadTaskInformation.JPG" />
                </li>
                <li className="user-footer">

                    <div className="row">
                        <div style={{ marginTop: '10px' }} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <a style={{ width: '100%' }} href="#modal-profile" data-toggle="modal" className="btn btn-default btn-flat"><i className="fa fa-info-circle"></i> {translate('auth.profile.title')} </a>
                        </div>
                        <div style={{ marginTop: '10px' }} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <a style={{ width: '100%' }} href="#modal-security" data-toggle="modal" className="btn btn-default btn-flat"><i className="fa fa-gear"></i> {translate('auth.security.label')} </a>
                        </div>
                        <div style={{ marginTop: '10px' }} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <button style={{ width: '100%' }} type="button" className="btn btn-default btn-flat pull-right" ><i className="fa fa-sign-out"></i> {translate('auth.logout')} </button>
                        </div>
                        <div style={{ marginTop: '10px' }} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <button style={{ width: '100%' }} type="button" className="btn btn-default btn-flat" ><i className="fa fa-power-off"></i> {translate('auth.logout_all_account')} </button>
                        </div>
                    </div>
                </li>
            </ul>
        </li>
    )

}
export default connect(null, null)(withTranslate(LoadTaskInformation));