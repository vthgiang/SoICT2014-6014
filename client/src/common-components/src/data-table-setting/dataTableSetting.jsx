import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti } from '../..';
import { SlimScroll } from '../..';
import './dataTableSetting.css';

class DataTableSetting extends Component {
    constructor(props) {
        super(props);
        this.record = React.createRef();
        this.state = {
            useScrollBar: false,
            hiddenColumns: [],
        };

        window.addEventListener("resize", () => {
            this.adjustSize(window.innerWidth);
        }, { passive: true });
    }

    componentDidMount() {
        this.adjustSize(window.innerWidth);
    }

    componentDidUpdate(){
        window.$(`#${this.props.tableId} td`).show();
        window.$(`#${this.props.tableId} th`).show();

        window.$(`#${this.props.tableId} th`).width(""); // Xóa các thuộc tính width

        const {hiddenColumns} = this.state;
        for (var j = 0, len = hiddenColumns.length; j < len; j++) {
            window.$(`#${this.props.tableId} td:nth-child(` + hiddenColumns[j] + `)`).hide();
            window.$(`#${this.props.tableId} thead th:nth-child(` + hiddenColumns[j] + `)`).hide();
        }
    }

    adjustSize = async (innerWidth) => {
        await this.setState(state => {
            return {
                ...state,
                useScrollBar: (innerWidth > 992 ? false : true) // 992: kích thước Bootstrap md
            }
        })
    }

    handleChangeHiddenColumns = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                hiddenColumns: value,
            }
        })
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

    setLimit = async () => {
        await window.$(`#setting-${this.props.tableId}`).collapse("hide");

        if(Number(this.props.limit) !== Number(this.record.current.value)){
            await this.props.setLimit(this.record.current.value);
        }
    }

    configTableWidth = async () => {
        await this.setState(state => {
            return {
                ...state,
                useScrollBar: this.refs.configCheckbox.checked
            }
        })

        window.$(`#setting-${this.props.tableId}`).collapse("hide");
    }

    render() {
        const { columnName, translate, columnArr = [], hideColumnOption = true, tableContainerId, tableId, tableWidth, limit = 5 } = this.props;

        return (
            <React.Fragment>
                <button type="button" data-toggle="collapse" data-target={`#setting-${tableId}`} className="pull-right" style={{ border: "none", background: "none", padding: "0px" }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                <div id={`setting-${tableId}`} className="box collapse setting-table">
                    <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>
                    {
                        hideColumnOption && columnArr.length > 0 &&
                        <div className="form-group">
                            <label className="form-control-static">{translate('table.hidden_column')}</label>
                            <SelectMulti id={`multiSelectHideColumn-${tableId}`} multiple="multiple"
                                options={{ nonSelectedText: translate('table.choose_hidden_columns'), allSelectedText: translate('table.hide_all_columns') }}
                                items={columnArr.map((col, i) => { return { value: i + 1, text: col } })}
                                onChange={this.handleChangeHiddenColumns}>
                            </SelectMulti>
                        </div>
                    }
                    <div className="form-group">
                        <label className="form-control-static">{translate('table.line_per_page')}</label>
                        <input className="form-control" type="Number" onKeyUp={this.handleEnterLimitSetting} defaultValue={limit} ref={this.record} />
                    </div>
                    <div className="form-group">
                        {window.$(`#${tableContainerId}`)[0] !== undefined &&
                            <React.Fragment>
                                <div className="checkbox">
                                    <label><input type="checkbox" checked={this.state.useScrollBar} ref="configCheckbox" onChange={this.configTableWidth} />Dùng thanh cuộn bảng</label>
                                </div>
                                <SlimScroll outerComponentId={tableContainerId} innerComponentId={tableId} innerComponentWidth={tableWidth} activate={this.state.useScrollBar} />
                            </React.Fragment>
                        }
                        <button type="button" className="btn btn-success pull-right" onClick={this.setLimit}>{translate('table.update')}</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const DataTableSettingExport = connect(mapState, null)(withTranslate(DataTableSetting));

export { DataTableSettingExport as DataTableSetting }