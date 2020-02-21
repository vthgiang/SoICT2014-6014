import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ActionColumn extends Component {
    constructor(props) {
        super(props);
        this.record = React.createRef();
        this.state = {  }
    }
    render() { 
        const { columnName, hideColumn, translate } = this.props;
        return ( 
            <React.Fragment>
                { columnName }
                <button type="button" data-toggle="collapse" data-target="#setting-table" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                <div id="setting-table" className="row collapse">
                    <span className="pop-arw arwTop L-auto" style={{ right: "13px" }}></span>
                    {
                        hideColumn && 
                            <div className="col-xs-12">
                            <label style={{ marginRight: "15px" }}>Ẩn cột:</label>
                            <select id="multiSelectShowColumn" multiple="multiple">
                                <option value="1">Tên mẫu</option>
                                <option value="2">Mô tả</option>
                                <option value="3">Số lần sử dụng</option>
                                <option value="4">Người tạo</option>
                                <option value="5">Đơn vị</option>
                                <option value="6">Hoạt động</option>
                            </select>
                        </div>
                    }
                    <div className="col-xs-12" style={{ marginTop: "10px" }}>
                        <label style={{ marginRight: "15px" }}>{translate('table.line_per_page')}</label>
                        <input className="form-control" type="text" defaultValue={5} ref={this.record}/>
                    </div>
                    <div className="col-xs-2 col-xs-offset-6" style={{ marginTop: "10px" }}>
                        <button type="button" className="btn btn-success" onClick={() => this.props.setLimit(this.record.current.value)}>{ translate('table.update') }</button>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(ActionColumn) );