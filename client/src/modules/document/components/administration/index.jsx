import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import AdministrationDocumentCategories from './categories';
import AdministrationDocumentDomains from './domains';
import AdministrationDocumentListData from './list-data';
import AdministrationStatisticsReport from './statistics-report';

class ManageDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        return ( 
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li><a href="#administration-document-list-data" data-toggle="tab">{translate('document.data')}</a></li>
                    <li><a href="#administration-document-categories" data-toggle="tab">{translate('document.category')}</a></li>
                    <li className="active"><a href="#administration-document-domains" data-toggle="tab">{translate('document.domain')}</a></li>
                    <li><a href="#administration-statistics-report" data-toggle="tab">{translate('document.statistics_report')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane" id="administration-document-list-data">
                        <AdministrationDocumentListData/>
                    </div>
                    <div className="tab-pane" id="administration-document-categories">
                        <AdministrationDocumentCategories/>
                    </div>
                    <div className="tab-pane active" id="administration-document-domains">
                        <AdministrationDocumentDomains/>
                    </div>
                    <div className="tab-pane" id="administration-statistics-report">
                        <AdministrationStatisticsReport/>
                    </div>
                </div>
            </div>
         );
    }
}
 
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(ManageDocument) );