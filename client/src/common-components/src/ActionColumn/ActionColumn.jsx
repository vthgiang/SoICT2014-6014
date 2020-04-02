import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti } from '../../';
import { slimScrollScript } from './jquery.slimscroll.min';
import './ActionColumn.css';

class ActionColumn extends Component {
    constructor(props) {
        super(props);
        this.record = React.createRef();
        this.state = {}
    }
    componentDidMount(){
        if (document.getElementById("script-slim-scroll") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-slim-scroll";
            script.innerHTML = slimScrollScript
            document.body.appendChild(script);
        }
    }

    handleEnterLimitSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.setLimit();
        }
    }

    setLimit = async() => {
        var test = window.$("#multiSelectShowColumn").val();
        window.$("td").show();
        window.$("th").show();
        for (var j = 0, len = test.length; j < len; j++) {
            window.$('td:nth-child(' + test[j] + ')').hide();
            window.$('th:nth-child(' + test[j] + ')').hide();
        }

        await window.$(`#setting-table`).collapse("hide");
        await this.props.setLimit(this.record.current.value);
    }

    configTableWidth = async() => {
        const { tableId, tableContainerId, tableWidth } = this.props;
        console.log(window.$(`#${tableContainerId}`)[0]);

        if ( window.$(`#${tableContainerId}`)[0] !== undefined){
            if (this.refs.configCheckbox.checked === true){
                window.$(`#${tableId}`)[0].style = "width: " + tableWidth;
                window.$(`#${tableContainerId}`).slimscroll({
                    axis: 'x',
                    width: '100%',
                    height: '100%'
                });
            } else {
                window.$(`#${tableContainerId}`)[0].style= "";
                window.$(`#${tableId}`)[0].style= "";
            }
        }
        window.$(`#setting-table`).collapse("hide");
    }

    render() {
        const { columnName, translate, columnArr, hideColumnOption, tableContainerId, limit=5 } = this.props;
        
        return (
            <React.Fragment>
                {columnName}
                <button type="button" data-toggle="collapse" data-target="#setting-table" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                <div id="setting-table" className="box collapse">
                    <span className="pop-arw arwTop L-auto" style={{ right: "30px" }}></span>
                    {
                        hideColumnOption && columnArr.length > 0 &&
                        <div className="form-group">
                            <label className="form-control-static">Ẩn cột</label>
                            <SelectMulti id={"multiSelectShowColumn"} multiple="multiple"
                                options= {{nonSelectedText: "Chọn cột muốn ẩn", allSelectedText: "Tất cả các cột"}}
                                items = { columnArr.map((col,i) => {return {value: i + 1, text: col}}) }>
                            </SelectMulti>
                        </div>
                    }
                    <div className="form-group">
                        <label className="form-control-static">{translate('table.line_per_page')}</label>
                        <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} defaultValue={limit} ref={this.record} />
                    </div>
                    <div className="form-group">
                        { window.$(`#${tableContainerId}`)[0] !== undefined &&
                            <div className="checkbox">
                                <label><input type="checkbox" ref="configCheckbox" onClick={this.configTableWidth}/>Cố định chiều rộng bảng</label>
                            </div>
                        }
                        <button type="button" className="btn btn-success pull-right" onClick={this.setLimit}>{translate('table.update')}</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const ActionColumnExport = connect(mapState, null)(withTranslate(ActionColumn));

export { ActionColumnExport as ActionColumn }