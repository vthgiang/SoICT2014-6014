import React, { Component } from 'react';

class ManageReport extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <div className="box box-primary" style={{ marginTop: '50px'}}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Thống kê số lượng tài liệu, văn bản, biểu mẫu, vv...</h3>
                        <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                        </button>
                        </div>
                        {/* /.box-tools */}
                    </div>
                    {/* /.box-header */}
                    <div className="box-body">
                    <div className="row">
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                            <div className="small-box bg-aqua">
                                <div className="inner">
                                    <h3>150</h3>
                                    <p>Văn bản</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-file" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    Chi tiết <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                            <div className="small-box bg-green">
                                <div className="inner">
                                    <h3>200</h3>
                                    <p>Biểu mẫu</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-file" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    Chi tiết <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                            <div className="small-box bg-yellow">
                                <div className="inner">
                                    <h3>300</h3>
                                    <p>Tài liệu</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-file" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    Chi tiết <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                            <div className="small-box bg-gray">
                                <div className="inner">
                                    <h3>200</h3>
                                    <p>Công văn</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-file" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    Chi tiết <i className="fa fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="container">
                        <h4><strong>Tổng số: <span style={{ color: 'red', fontSize: '48px' }}>850</span></strong></h4>
                    </div>
                </div>       
                <div className="box box-primary" style={{ marginTop: '50px'}}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Thống kê số lượt DOWNLOAD</h3>
                        <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                        </button>
                        </div>
                        {/* /.box-tools */}
                    </div>
                    {/* /.box-header */}
                    <div className="box-body">
                        <div className="row">
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                    <span className="info-box-icon bg-aqua"><i className="fa fa-file-o" /></span>
                                    <div className="info-box-content">
                                    <span className="info-box-text">Văn bản</span>
                                    <span className="info-box-number">500</span> lượt download
                                    </div>  
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                    <span className="info-box-icon bg-green"><i className="fa fa-file-o" /></span>
                                    <div className="info-box-content">
                                    <span className="info-box-text">Tài liệu</span>
                                    <span className="info-box-number">300</span> lượt download
                                    </div>  
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                    <span className="info-box-icon bg-yellow"><i className="fa fa-file-o" /></span>
                                    <div className="info-box-content">
                                    <span className="info-box-text">Biểu mẫu</span>
                                    <span className="info-box-number">450</span> lượt download
                                    </div>  
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="info-box">
                                    <span className="info-box-icon bg-gray"><i className="fa fa-file-o" /></span>
                                    <div className="info-box-content">
                                    <span className="info-box-text">Công văn</span>
                                    <span className="info-box-number">100</span> lượt download
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4><strong>Tổng số: <span style={{ color: 'red', fontSize: '48px' }}>1350</span></strong> lượt download</h4>
                    </div>
                </div> 
                              
            </React.Fragment>
         );
    }
}
 
export default ManageReport;