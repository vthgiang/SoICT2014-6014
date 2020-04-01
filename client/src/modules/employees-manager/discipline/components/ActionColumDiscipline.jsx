import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti } from '../../../../common-components/src/SelectMulti/SelectMulti';
import '../../../../common-components/src/ActionColumn.css';

class ActionColumnDiscipline extends Component {
    constructor(props) {
        super(props);
        this.record = React.createRef();
        this.state = {}
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
        var test = window.$("#multiSelectShowColumn").val();
        window.$("td").show();
        window.$("th").show();
        for (var j = 0, len = test.length; j < len; j++) {
            window.$('td:nth-child(' + test[j] + ')').hide();
            window.$('th:nth-child(' + test[j] + ')').hide();
        }

        await window.$(`#setting-table2`).collapse("hide");
        await this.props.setLimit(this.record.current.value);
    }

    render() {
        const { columnName, translate, columnArr, hideColumnOption, limit = 5 } = this.props;
        console.log(this.props)
        return (
            <React.Fragment>
                {columnName}
                <button type="button" data-toggle="collapse" data-target="#setting-table2" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                <div id="setting-table2" className="box collapse setting-table">
                    <span className="pop-arw arwTop L-auto" style={{ right: "30px" }}></span>
                    {
                        hideColumnOption && columnArr.length > 0 &&
                        <div className="form-group">
                            <label className="form-control-static">Ẩn cột</label>
                            <SelectMulti id={"multiSelectShowColumn"} multiple="multiple"
                                nonSelectedText="Chọn cột muốn ẩn" allSelectedText="Tất cả các cột"
                                items={columnArr.map((col, i) => { return { value: i + 1, text: col } })}>
                            </SelectMulti>
                        </div>
                    }
                    <div className="form-group">
                        <label className="form-control-static">{translate('table.line_per_page')}</label>
                        <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} defaultValue={limit} ref={this.record} />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success pull-right" onClick={this.setLimit}>{translate('table.update')}</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actionColumnDiscipline = connect(mapState, null)(withTranslate(ActionColumnDiscipline));

export { actionColumnDiscipline as ActionColumnDiscipline }