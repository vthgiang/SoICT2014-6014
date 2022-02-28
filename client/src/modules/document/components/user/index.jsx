import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import UserDocumentsData from './documents';
import DocumentShow from './history-statistics/documentShow';

function Document(props) {
    const { translate } = props;
    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#user-documents" data-toggle="tab">{translate('document.data')}</a></li>
                <li><a href="#user-document-history-document-downloaded" data-toggle="tab">{translate('document.downloaded')}</a></li>
                <li><a href="#user-document-history-document-common" data-toggle="tab">{translate('document.popular')}</a></li>
                <li><a href="#user-document-history-document-new" data-toggle="tab">{translate('document.new')}</a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="user-documents">
                    <UserDocumentsData />
                </div>
                <div className="tab-pane" id="user-document-history-document-downloaded">
                    <DocumentShow type="downloaded" typeId="downloaded"/>
                </div>
                <div className="tab-pane" id="user-document-history-document-common">
                    <DocumentShow type="common" typeId="common" />
                </div>
                <div className="tab-pane" id="user-document-history-document-new">
                    <DocumentShow type="latest" typeId="new" />
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(Document));