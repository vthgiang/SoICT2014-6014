import React, { Component } from 'react';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
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
                    <li><a title="Thông báo để biết, không phải làm gì"><i className="fa fa-info-circle text-blue"/> Inform <span className="label label-primary pull-right">5/40</span></a></li>
                    <li><a title="Thông báo việc cần làm"><i className="fa fa-inbox text-green"/> Normal <span className="label label-success pull-right">9/34</span></a></li>
                    <li><a title="Thông báo việc quan trọng"><i className="fa fa-warning text-orange" /> Warning <span className="label label-warning pull-right">8/16</span></a></li>
                    <li><a title="Thông báo đặc biệt quan trọng, việc quá hạn"><i className="fa fa-hourglass-end text-red"/> Error <span className="label label-danger pull-right">1/3</span></a></li>
                    <li><a href="#" className="text-black"><i className="fa fa-bars"/> Tất cả <span className="label label-default pull-right">23/93</span></a></li>
                </ul>
                </div>
            </div>
         );
    }
}
 
export default NotificationMenu;