import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import AdministrationDocumentCategories from './administration/categories';
import AdministrationDocumentDomains from './administration/domains';
import AdministrationDocumentListData from './administration/list-data';

class Document extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li><a href="#administration-document-categories" data-toggle="tab">Loại văn bản</a></li>
                    <li><a href="#administration-document-domains" data-toggle="tab">Danh mục văn bản</a></li>
                    <li className="active"><a href="#administration-document-list-data" data-toggle="tab">Bảng dữ liệu</a></li>
                    <li><a href="#administration-statistics-report" data-toggle="tab">Thống kê báo cáo</a></li>
                    <li><a href="#user-documents" data-toggle="tab">Bảng dữ liệu (của user)</a></li>
                    <li><a href="#user-history-statistics" data-toggle="tab">Lịch sử và thống kê</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane" id="administration-document-categories">
                        <AdministrationDocumentCategories/>
                    </div>
                    <div className="tab-pane" id="administration-document-domains">
                        <AdministrationDocumentDomains/>
                    </div>
                    <div className="tab-pane active" id="administration-document-list-data">
                        <AdministrationDocumentListData/>
                    </div>
                </div>
            </div>
         );
    }
}
 
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(Document) );