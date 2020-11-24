import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, SelectBox, SelectMulti } from '../../../../../common-components';

class ManufacturingLotManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            createdAt: "",
            expirationDate: "",
            good: ""
        }
    }

    render() {
        const { translate } = this.props;
        const { code, createdAt, expirationDate, good } = this.state;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.code')}</label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} placeholder="LOT202011111" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.created_at')}</label>
                            <DatePicker
                                id={`createdAt-manufacturing-lot`}
                                value={createdAt}
                                onChange={this.handleCreatedAtChange}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.command_code')}</label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} placeholder="LSX202000001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.expiration_date')}</label>
                            <DatePicker
                                id={`expirationDate-manufacturing-lot`}
                                value={expirationDate}
                                onChange={this.handleCreatedAtChange}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.good')}</label>
                            <SelectBox
                                id={`select-works`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good}
                                items={[{
                                    value: 1, text: "A"
                                }, {
                                    value: 2, text: "B"
                                }]}
                                onChange={this.handleManufacturingWorksChange}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-manufacturing-lot`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.lot.choose_status'), allSelectedText: translate('manufacturing.lot.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manufacturing.lot.1.content') },
                                    { value: '2', text: translate('manufacturing.lot.2.content') },
                                    { value: '3', text: translate('manufacturing.lot.3.content') },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.command.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.command.search')}</button>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export default connect(null, null)(withTranslate(ManufacturingLotManagementTable));