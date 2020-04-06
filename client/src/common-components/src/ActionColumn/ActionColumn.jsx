import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti } from '../../';
import { SlimScroll } from '../../';
import './ActionColumn.css';

class ActionColumn extends Component {
    constructor(props) {
        super(props);
        this.record = React.createRef();
        this.state = { fixTableWidth: false };

        window.addEventListener("resize", () => {
            this.adjustSize(window.innerWidth);
        }, { passive: true });
    }

    componentDidMount() {
        this.adjustSize(window.innerWidth);
    }

    adjustSize = async (innerWidth) => {
        await this.setState(state => {
            return {
                ...state,
                fixTableWidth: (innerWidth > 992 ? false : true) // 992: kích thước Bootstrap md
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
        var hideColumn = window.$(`#multiSelectHideColumn-${this.props.tableId}`).val();
        window.$("td").show();
        window.$("th").show();
        for (var j = 0, len = hideColumn.length; j < len; j++) {
            window.$(`#${this.props.tableId} td:nth-child(` + hideColumn[j] + `)`).hide();
            window.$(`#${this.props.tableId} th:nth-child(` + hideColumn[j] + `)`).hide();
        }

        await window.$(`#setting-${this.props.tableId}`).collapse("hide");
        await this.props.setLimit(this.record.current.value, hideColumn);
    }

    configTableWidth = async () => {
        await this.setState(state => {
            return {
                ...state,
                fixTableWidth: this.refs.configCheckbox.checked
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
                                options={{ nonSelectedText: translate('table.choose_hidden_column'), allSelectedText: translate('table.all') }}
                                items={columnArr.map((col, i) => { return { value: i + 1, text: col } })}>
                            </SelectMulti>
                        </div>
                    }
                    <div className="form-group">
                        <label className="form-control-static">{translate('table.line_per_page')}</label>
                        <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} defaultValue={limit} ref={this.record} />
                    </div>
                    <div className="form-group">
                        {window.$(`#${tableContainerId}`)[0] !== undefined &&
                            <React.Fragment>
                                <div className="checkbox">
                                    <label><input type="checkbox" checked={this.state.fixTableWidth} ref="configCheckbox" onChange={this.configTableWidth} />Dùng thanh cuộn bảng</label>
                                </div>
                                <SlimScroll outerComponentId={tableContainerId} innerComponentId={tableId} innerComponentWidth={tableWidth} activate={this.state.fixTableWidth} />
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
const ActionColumnExport = connect(mapState, null)(withTranslate(ActionColumn));

export { ActionColumnExport as ActionColumn }