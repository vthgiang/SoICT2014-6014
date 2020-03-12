import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">Danh mục</h3>
                        <div className="box-tools">
                            <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                            </button>
                        </div>
                    </div>
                    <div className="box-body no-padding">
                        <ul className="nav nav-pills nav-stacked">
                            <li><a href="#" className="text-black"><i className="fa fa-download"/>{translate('notification.receivered')}<span className="label label-default pull-right">93</span></a></li>
                            {/* <li><a title="Thông báo để biết, không phải làm gì"><i className="fa fa-info-circle text-green"/><span className="label label-success pull-right">40</span></a></li>
                            <li><a title="Thông báo việc cần làm"><i className="fa fa-question-circle text-blue"/><span className="label label-primary pull-right">34</span></a></li>
                            <li><a title="Thông báo việc quan trọng"><i className="fa fa-warning text-orange" /><span className="label label-warning pull-right">16</span></a></li>
                            <li><a title="Thông báo đặc biệt quan trọng, việc quá hạn"><i className="fa fa-hourglass-end text-red"/><span className="label label-danger pull-right">3</span></a></li> */}
                            <li><a href="#" className="text-black"><i className="fa fa-upload"/>{translate('notification.added')}<span className="label label-default pull-right">50</span></a></li>
                        </ul>
                    </div>
                </div>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">Chú thích</h3>
                        <div className="box-tools">
                            <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                            </button>
                        </div>
                    </div>
                    <div className="box-body no-padding">
                        <ul className="nav nav-pills nav-stacked">
                            <li><a title="Thông báo để biết"><i className="fa fa-info-circle text-green"/>Thông báo để biết</a></li>
                            <li><a title="Thông báo việc cần làm"><i className="fa fa-question-circle text-blue"/>Thông báo việc cần làm</a></li>
                            <li><a title="Thông báo việc quan trọng"><i className="fa fa-warning text-orange" />Thông báo việc quan trọng</a></li>
                            <li><a title="Thông báo đặc biệt quan trọng"><i className="fa fa-hourglass-end text-red"/>Thông báo đặc biệt quan trọng</a></li>
                        </ul>
                    </div>  
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;

export default connect(mapState, null)(withTranslate(NotificationMenu));