import React, { Component } from 'react';
import ManageDocument from './ManageDocument';
import ManageDocumentType from './ManageDocumentType';
import ManageReport from './ManageReport';
import SearchDocument from './SearchDocument';
import HistoryStatistics from './HistoryStatistics';

class ManageFormDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#tab_1" data-toggle="tab">Quản lý văn bản</a></li>
                        <li className=""><a href="#tab_2" data-toggle="tab">Quản lý loại văn bản</a></li>
                        <li className=""><a href="#tab_3" data-toggle="tab">Quản lý thống kê báo cáo</a></li>
                        <li className=""><a href="#tab_4" data-toggle="tab">Tìm văn bản tài liệu</a></li>
                        <li className=""><a href="#tab_5" data-toggle="tab">Lịch sử và thống kê</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active" id="tab_1">
                            <ManageDocument/>
                        </div>
                        <div className="tab-pane" id="tab_2">
                            <ManageDocumentType/>
                        </div>
                        <div className="tab-pane" id="tab_3">
                            <ManageReport/>
                        </div>
                        <div className="tab-pane" id="tab_4">
                            <SearchDocument/>
                        </div>
                        <div className="tab-pane" id="tab_5">
                            <HistoryStatistics/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default ManageFormDocument;