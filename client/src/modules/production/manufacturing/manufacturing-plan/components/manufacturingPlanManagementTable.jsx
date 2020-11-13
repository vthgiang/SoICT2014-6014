import React, { Component } from 'react';
import { DataTableSetting, DatePicker, formatDate, SelectMulti } from "../../../../../common-components";
import NewPlanCreateForm from './create-new-plan/newPlanCreateForm';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { manufacturingPlanActions } from '../redux/actions';
class ManufacturingPlanManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5
        }
    }

    componentDidMount = () => {
        const currentRole = localStorage.getItem("currentRole");
        const data = {
            page: this.state.page,
            limit: this.state.limit,
            currentRole: currentRole
        }
        this.props.getAllManufacturingPlans(data);
    }

    handleShowDetailInfo = async (id) => {
        await this.setState((state) => {
            return {
                ...state,
                manufacturingOrderId: id
            }
        });
        window.$(`#modal-detail-info-manufacturing-order`).modal('show');
    }

    render() {
        const { translate, manufacturingPlan } = this.props;
        let listPlans = [];
        if (manufacturingPlan.listPlans && manufacturingPlan.isLoading === false) {
            listPlans = manufacturingPlan.listPlans;
        }
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <NewPlanCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="KH001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.start_date')}</label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>


                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.manufacturing_order_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.end_date')}</label>
                            <DatePicker
                                id={`maintain_after_1`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.sales_order_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DKD001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.created_at')}</label>
                            <DatePicker
                                id={`maintain_after_2`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.command_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="LSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-plan`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.plan.choose_status'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Đang chờ duyệt" },
                                    { value: '2', text: "Đã duyệt" },
                                    { value: '3', text: "Đang thực hiện" },
                                    { value: '4', text: "Đã hoàn thành" },
                                    { value: '5', text: "Đã hủy" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.works')}</label>
                            <SelectMulti
                                id={`select-multi-works`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn nhà máy", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Nha may 1" },
                                    { value: '2', text: "Nha may 2" },
                                    { value: '3', text: "Nha may 3" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.progess')}</label>
                            <SelectMulti
                                id={`select-multi-progress-plan`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.plan.choose_progess'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Đúng tiến độ" },
                                    { value: '2', text: "Chậm tiến độ" },
                                    { value: '3', text: "Quá hạn" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.plan.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.plan.search')}</button>
                        </div>
                    </div>

                    <table id="manufacturing-plan-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.plan.index')}</th>
                                <th>{translate('manufacturing.plan.code')}</th>
                                <th>{translate('manufacturing.plan.creator')}</th>
                                <th>{translate('manufacturing.plan.created_at')}</th>
                                <th>{translate('manufacturing.plan.start_date')}</th>
                                <th>{translate('manufacturing.plan.end_date')}</th>
                                <th>{translate('manufacturing.plan.status')}</th>
                                <th>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="manufacturing-plan-table"
                                        columnArr={[
                                            translate('manufacturing.plan.index'),
                                            translate('manufacturing.plan.code'),
                                            translate('manufacturing.plan.creator'),
                                            translate('manufacturing.plan.created_at'),
                                            translate('manufacturing.plan.start_date'),
                                            translate('manufacturing.plan.end_date'),
                                            translate('manufacturing.plan.status')
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listPlans && listPlans.length !== 0) &&
                                listPlans.map((plan, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{plan.code}</td>
                                        <td>{plan.creator && plan.creator.name}</td>
                                        <td>{formatDate(plan.createdAt)}</td>
                                        <td>{formatDate(plan.startDate)}</td>
                                        <td>{formatDate(plan.endDate)}</td>
                                        <td style={{ color: translate(`manufacturing.plan.${plan.status}.color`) }}>{translate(`manufacturing.plan.${plan.status}.content`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title="Xem chi tiết kế hoạch sản xuất" onClick={() => this.handleShowDetailInfo(plan._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa kế hoạch sản xuất"><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingPlan } = state;
    return { manufacturingPlan };
}

const mapDispatchToProps = {
    getAllManufacturingPlans: manufacturingPlanActions.getAllManufacturingPlans
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingPlanManagementTable));