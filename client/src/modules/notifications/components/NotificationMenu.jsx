import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { translate, notification } = this.props;
        return ( 
            <React.Fragment>
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