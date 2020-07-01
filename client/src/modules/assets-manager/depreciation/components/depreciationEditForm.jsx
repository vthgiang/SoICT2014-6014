import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { AssetCreateValidator } from '../../asset-create/components/assetCreateValidator';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { DepreciationActions } from '../redux/actions';
import moment from 'moment';

class DepreciationEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    /**
     * Bắt sự kiện thay đổi nguyên giá
     */
    handleCostChange = (e) => {
        const { value } = e.target;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateCost(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Giá trị thu hồi dự tính
     */
    handleResidualValueChange = (e) => {
        const { value } = e.target;
        this.validateResidualValue(value, true);
    }
    validateResidualValue = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateResidualValue(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnResidualValue: msg,
                    residualValue: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian trích khấu hao
     */
    handleUsefulLifeChange = (e) => {
        const { value } = e.target;
        this.validateUsefulLife(value, true);
    }
    validateUsefulLife = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateUsefulLife(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnUsefulLife: msg,
                    usefulLife: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian bắt đầu trích khấu hao
     */
    handleStartDepreciationChange = (value) => {
        this.validateStartDepreciation(value, true);
    }
    validateStartDepreciation = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDepreciation(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDepreciation: msg,
                    startDepreciation: value,
                }
            });
        }
        return msg === undefined;
    }


    addMonthToEndDepreciation = (day) => {
        if (day !== undefined) {
            let { usefulLife } = this.state,
                splitDay = day.toString().split('-'),
                currentDate = moment(`${splitDay[2]}-${splitDay[1]}-${splitDay[0]}`),
                futureMonth = moment(currentDate).add(usefulLife, 'M'),
                futureMonthEnd = moment(futureMonth).endOf('month');
            if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                futureMonth = futureMonth.add(1, 'd');
            }
            return futureMonth.format('DD-MM-YYYY');
        }
    };

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            // this.validateCost(this.state.cost, false) &&
            // this.validateUsefulLife(this.state.usefulLife, false) &&
            this.validateStartDepreciation(this.state.startDepreciation, false)
        return result;
    }

    save = () => {
        var partDepreciation = this.state.startDepreciation.split('-');
        var startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;
        if (this.isFormValidated()) {
            let dataToSubmit = {
                cost: this.state.cost,
                usefulLife: this.state.usefulLife,
                startDepreciation: startDepreciation,
                residualValue: this.state.residualValue,
                assetId
            }
            return this.props.updateDepreciation(this.props._id, dataToSubmit);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                usefulLife: nextProps.usefulLife,
                startDepreciation: nextProps.startDepreciation,
                errorOnStartDepreciation: undefined,
                errorOnUsefulLife: undefined,
            }
        } else {
            return null;
        }
    }


    render() {
        const { _id, translate, assetsManager } = this.props;
        var assetlist = assetsManager.listAssets;
        const { asset,
            cost, residualValue, usefulLife, startDepreciation, endDepreciation, annualDepreciationValue,
            monthlyDepreciationValue, errorOnCost, errorOnStartDepreciation, errorOnUsefulLife
        } = this.state;
        console.log(this.state, 'this.state-dep')
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-depreciation"
                    formID="form-edit-depreciation"
                    title="Chỉnh sửa thông tin khấu hao tài sản"
                    func={this.save}
                disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-depreciation">
                        <div className="col-md-12">

                            <div className={`form-group`}>
                                <label>Tài sản</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`edit-incident-asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                            onChange={this.handleAssetChange}
                                            value={_id}
                                            multiple={false}
                                        // disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group ${errorOnCost === undefined ? "" : "has-error"} `}>
                                <label htmlFor="cost">Nguyên giá (VNĐ)<span className="text-red">*</span></label><br />
                                <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange}
                                    placeholder="Nguyên giá" autoComplete="off" />
                                <ErrorLabel content={errorOnCost} />
                            </div>
                            <div className={`form-group`}>
                                <label htmlFor="residualValue">Giá trị thu hồi ước tính (VNĐ)</label><br />
                                <input type="number" className="form-control" name="residualValue" value={residualValue} onChange={this.handleResidualValueChange}
                                    placeholder="Giá trị thu hồi ước tính" autoComplete="off" />
                            </div>
                            <div className={`form-group ${errorOnUsefulLife === undefined ? "" : "has-error"} `}>
                                <label htmlFor="usefulLife">Thời gian sử dụng (Tháng)<span className="text-red">*</span> (Ghi chú: Thời gian sử dụng = Thời gian trích khấu hao)</label>
                                <input type="number" className="form-control" name="usefulLife" value={usefulLife} onChange={this.handleUsefulLifeChange}
                                    placeholder="Thời gian trích khấu hao" autoComplete="off" />
                                <ErrorLabel content={errorOnUsefulLife} />
                            </div>
                            <div className={`form-group ${errorOnStartDepreciation === undefined ? "" : "has-error"} `}>
                                <label htmlFor="startDepreciation">Thời gian bắt đầu trích khấu hao<span className="text-red">*</span> (Ghi chú: giá trị default = ngày nhập tài sản)</label>
                                <DatePicker
                                    id={`startDepreciation${_id}`}
                                    value={startDepreciation}
                                    onChange={this.handleStartDepreciationChange}
                                />
                                <ErrorLabel content={errorOnStartDepreciation} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="endDepreciation">Thời gian kết thúc trích khấu hao (Ghi chú: thời gian kết thúc = thời gian bắt đầu + thời gian trích khấu hao)</label><br />
                                <input
                                    className="form-control"
                                    id={`endDepreciation-${_id}`}
                                    value={startDepreciation !== "" ? this.addMonthToEndDepreciation(startDepreciation) : ""}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="annualDepreciationValue">Mức độ khấu hao trung bình hằng năm (VNĐ/Năm)</label><br />
                                <input type="number" className="form-control" name="annualDepreciationValue" value={(12 * cost) / usefulLife}
                                    placeholder="Mức độ khấu hao trung bình hằng năm = ( 12 x Nguyên giá ) / Thời gian trích khấu hao" autoComplete="off" disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="monthlyDepreciationValue">Mức độ khấu hao trung bình hằng tháng (VNĐ/Tháng)</label><br />
                                <input type="number" className="form-control" name="monthlyDepreciationValue" value={cost / usefulLife}
                                    placeholder="Mức độ khấu hao trung bình hằng tháng = Nguyên giá / Thời gian trích khấu hao" autoComplete="off" disabled />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    updateDepreciation: DepreciationActions.updateDepreciation,
};

const editForm = connect(mapState, actionCreators)(withTranslate(DepreciationEditForm));
export { editForm as DepreciationEditForm };
