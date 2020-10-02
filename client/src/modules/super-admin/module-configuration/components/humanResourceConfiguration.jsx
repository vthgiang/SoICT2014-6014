import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectBox } from '../../../../common-components';

import { ConfigurationActions } from '../redux/actions';

class HumanResourceConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            nextProps.getConfiguration();
            return {
                id: nextProps.id,
                dataStatus: 1
            }
        };
        return null
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.dataStatus === 1 && nextProps.modelConfiguration.humanResourceConfig) { // Dữ liệu đã về
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: 2,
                    humanResourceConfig: nextProps.modelConfiguration.humanResourceConfig
                }
            });
            return false;
        }

        if (this.state.dataStatus === 2) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: 3,
                }
            });
            return true;
        };

        return true;
    }
    handleContractNoticeTimeChange = (e) => {
        const { value } = e.target;
        let { humanResourceConfig } = this.state;
        humanResourceConfig.contractNoticeTime = value;
        this.setState({
            humanResourceConfig: humanResourceConfig,
        })
    }

    /**
     * Function thay đổi kiểu chấm công
     * @param {*} value 
     */
    handleTimekeepingTypeChange = (value) => {
        let { humanResourceConfig } = this.state;
        humanResourceConfig.timekeepingType = value[0];
        this.setState({
            humanResourceConfig: humanResourceConfig,
        })
    }

    /** Function thay đổi giờ của các ca làm việc */
    handleShiftTimeChange = (e) => {
        const { name, value } = e.target;
        let { humanResourceConfig } = this.state;
        humanResourceConfig.timekeepingByShift[name] = value;
        this.setState({
            humanResourceConfig: humanResourceConfig,
        })
    }

    save = () => {
        const { humanResourceConfig } = this.state;
        console.log(humanResourceConfig);
        this.props.editConfiguration({ humanResource: humanResourceConfig });
    }

    render() {
        const { translate } = this.props;

        const { id, humanResourceConfig } = this.state;
        let contractNoticeTime = '', timekeepingType = '', timekeepingByShift = '', timekeepingByShiftAndHour = '';
        if (humanResourceConfig) {
            contractNoticeTime = humanResourceConfig.contractNoticeTime;
            timekeepingType = humanResourceConfig.timekeepingType;
            timekeepingByShift = humanResourceConfig.timekeepingByShift;
            timekeepingByShiftAndHour = humanResourceConfig.timekeepingByShiftAndHour;
        };

        return (
            <div id={id} className="tab-pane active">
                <div className="row box-body">
                    {/* Kiểu chấm công*/}
                    <div className="form-group col-md-4">
                        <label >Kiểu chấm công</label>
                        <SelectBox
                            id={`timekeeping-type`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={timekeepingType}
                            items={[{ value: 'shift', text: 'Chấm công theo ca' }, { value: 'hours', text: 'Chấm công theo giờ' }, { value: 'shift_and_hour', text: 'Chấm công theo ca và giờ' }]}
                            onChange={this.handleTimekeepingTypeChange}
                        />
                    </div>

                    {/* Báo hết hạn hợp đồng (ngày) */}
                    <div className="form-group col-md-4">
                        <label>Báo hết hạn hợp đồng (ngày)</label>
                        <input type="number" min='0' step='1' value={contractNoticeTime} className="form-control" name="contractNoticeTimes" onChange={this.handleContractNoticeTimeChange} placeholder='Báo trước hết hạn hợp đồng' />
                    </div>
                    {
                        timekeepingType === 'shift' &&
                        <div className="col-md-12">
                            <div id="work_plan" className="description-box qlcv" style={{ paddingRight: 10 }}>
                                <h4>{`Chấm công theo ca`}</h4>
                                {/* Số giờ ca 1 */}
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label>Số giờ ca 1 (giờ)</label>
                                        <input type="number" min='0' value={timekeepingByShift.shift1Time} className="form-control" name="shift1Time" onChange={this.handleShiftTimeChange} />
                                    </div>
                                </div>

                                {/* Số giờ ca 2 */}
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label>Số giờ ca 2 (giờ)</label>
                                        <input type="number" min='0' value={timekeepingByShift.shift2Time} className="form-control" name="shift2Time" onChange={this.handleShiftTimeChange} />
                                    </div>
                                </div>

                                {/* Số giờ ca 3 */}
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label>Số giờ ca 3 (giờ)</label>
                                        <input type="number" min='0' value={timekeepingByShift.shift3Time} className="form-control" name="shift3Time" onChange={this.handleShiftTimeChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="col-md-12">
                        <button type="button" className="btn pull-right btn-success" onClick={() => this.save()} >{translate('human_resource.work_plan.save_as')}</button>
                    </div>
                </div>
            </div>
        );
    };
}

function mapState(state) {
    const { modelConfiguration } = state;
    return { modelConfiguration };
};

const actionCreators = {
    getConfiguration: ConfigurationActions.getConfiguration,
    editConfiguration: ConfigurationActions.editConfiguration,
};

const humanResource = connect(mapState, actionCreators)(withTranslate(HumanResourceConfiguration));
export { humanResource as HumanResourceConfiguration };