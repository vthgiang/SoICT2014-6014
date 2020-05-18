import React, { Component } from 'react';

class AdministrationStatisticsReport extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <div className="row text-center">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <p className="text-right">Tổng số: 100</p>
                        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                            <p style={{color: 'gray'}}>Biểu mẫu</p>
                            <p style={{fontSize: '24px'}}><b>14</b></p>
                            <p>1200<i> tải xuống</i></p>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                            <p style={{color: 'gray'}}>Công văn</p>
                            <p style={{fontSize: '24px'}}><b>26</b></p>
                            <p>1200<i> tải xuống</i></p>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                            <p style={{color: 'gray'}}>Tài liệu</p>
                            <p style={{fontSize: '24px'}}><b>28</b></p>
                            <p>1200<i> tải xuống</i></p>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                            <p style={{color: 'gray'}}>Văn bản</p>
                            <p style={{fontSize: '24px'}}><b>32</b></p>
                            <p>1200<i> tải xuống</i></p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default AdministrationStatisticsReport;