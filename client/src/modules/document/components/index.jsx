import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import AdministrationDocumentCategories from './administration/categories';
import AdministrationDocumentDomains from './administration/domains';
import AdministrationDocumentListData from './administration/list-data';
import AdministrationStatisticsReport from './administration/statistics-report';
import UserDocumentsData from './user/documents';
import DocumentUserHistoryStatistics from './user/history-statistics';

class Document extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        return ( 
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    {
                        <React.Fragment>
                            <li className="active"><a href="#administration-document-list-data" data-toggle="tab">{translate('document.data')}</a></li>
                            <li><a href="#administration-document-categories" data-toggle="tab">{translate('document.category')}</a></li>
                            <li><a href="#administration-document-domains" data-toggle="tab">{translate('document.domain')}</a></li>
                            <li><a href="#administration-statistics-report" data-toggle="tab">{translate('document.statistics_report')}</a></li>
                        </React.Fragment>
                    }
                    {
                        <React.Fragment>
                            <li><a href="#user-documents" data-toggle="tab">{translate('document.data')}</a></li>
                            <li><a href="#user-document-history-statistics" data-toggle="tab">{translate('document.history_report')}</a></li>
                        </React.Fragment>
                    }
                </ul>
                <div className="tab-content">
                    {
                        <React.Fragment>
                            <div className="tab-pane active" id="administration-document-list-data">
                                <AdministrationDocumentListData/>
                            </div>
                            <div className="tab-pane" id="administration-document-categories">
                                <AdministrationDocumentCategories/>
                            </div>
                            <div className="tab-pane" id="administration-document-domains">
                                <AdministrationDocumentDomains/>
                            </div>
                            <div className="tab-pane" id="administration-statistics-report">
                                <AdministrationStatisticsReport/>
                            </div>
                        </React.Fragment>
                    }
                    {
                        <React.Fragment>
                            <div className="tab-pane" id="user-documents">
                                <UserDocumentsData/>
                            </div>
                            <div className="tab-pane" id="user-document-history-statistics">
                                <DocumentUserHistoryStatistics/>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
         );
    }
}
 
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(Document) );