import React, { Component } from 'react';
import ManageDocument from './manageDocument';
import ManageDocumentType from './manageDocumentType';
import ManageReport from './manageReport';
import SearchDocument from './searchDocument';
import HistoryStatistics from './historyStatistics';

class ManageFormDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
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
             
                </div>
            </div>
         );
    }
}
 
export default ManageFormDocument;