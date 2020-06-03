import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import UserDocumentsData from './documents';
import DocumentUserHistoryStatistics from './history-statistics';

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
                    <li className="active"><a href="#user-documents" data-toggle="tab">{translate('document.data')}</a></li>
                    <li><a href="#user-document-history-statistics" data-toggle="tab">{translate('document.history_report')}</a></li>
                        
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="user-documents">
                        <UserDocumentsData/>
                    </div>
                    <div className="tab-pane" id="user-document-history-statistics">
                        <DocumentUserHistoryStatistics/>
                    </div>
                </div>
            </div>
         );
    }
}
 
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(Document) );