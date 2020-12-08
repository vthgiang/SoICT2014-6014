import React, { Component } from 'react';
import { formatDate } from '../../../../../helpers/formatDate';
import { DataTableSetting, DatePicker, PaginateBar, SelectMulti } from "../../../../../common-components";
import NewPlanCreateForm from './create-new-plan/newPlanCreateForm';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { manufacturingPlanActions } from '../redux/actions';
import { worksActions } from '../../manufacturing-works/redux/actions';
class ManufacturingPlanManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            page: 1,
            limit: 5,
            code: '',
            startDate: '',
            endDate: '',
            createdAt: '',
            status: [],
            manufacturingWorks: [],
            commandCode: '',
            manufacturingOrderCode: '',
            salesOrderCode: '',
            progress: []
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
        this.props.getAllManufacturingWorks({ currentRole: currentRole });
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

    // checkHasComponent = (name) => {
    //     let { auth } = this.props;
    //     let result = false;
    //     auth.components.forEach(component => {
    //         if (component.name === name) result = true;
    //     });

    //     return result;
    // }

    handleCodeChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            code: value
        }))
    }

    handleStartDateChange = (value) => {
        this.setState((state) => ({
            ...state,
            startDate: value
        }))
    }

    handleEndDateChange = (value) => {
        this.setState((state) => ({
            ...state,
            endDate: value
        }))
    }

    handleCreatedAtChange = (value) => {
        this.setState((state) => ({
            ...state,
            createdAt: value
        }))
    }

    handleStatusChange = (value) => {
        this.setState((state) => ({
            ...state,
            status: value
        }))
    }

    handleSubmitSearch = () => {
        const { code, startDate, endDate, createdAt, status, page, limit,
            manufacturingWorks, currentRole, commandCode, manufacturingOrderCode, salesOrderCode, progress } = this.state;
        const data = {
            currentRole: currentRole,
            page: page,
            limit: limit,
            code: code,
            startDate: startDate,
            endDate: endDate,
            createdAt: createdAt,
            status: status,
            manufacturingWorks: manufacturingWorks,
            commandCode: commandCode,
            manufacturingOrderCode: manufacturingOrderCode,
            salesOrderCode: salesOrderCode,
            progress: progress
        }
        this.props.getAllManufacturingPlans(data);
    }

    getListManufacturingWorksArr = () => {
        const { manufacturingWorks } = this.props;
        const { listWorks } = manufacturingWorks;
        let listManufacturingWorksArr = [];
        if (listWorks) {
            listWorks.map((works) => {
                listManufacturingWorksArr.push({
                    value: works._id,
                    text: works.code + " - " + works.name
                });
            });
        }
        return listManufacturingWorksArr;
    }

    handleManufacturingWorksChange = (value) => {
        this.setState((state) => ({
            ...state,
            manufacturingWorks: value
        }))
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
            page: this.state.page
        });
        this.props.getAllManufacturingPlans(this.state);
    }

    setPage = async (page) => {
        await this.setState({
            page: page,
            limit: this.state.limit
        });
        this.props.getAllManufacturingPlans(this.state);
    }

    handleCommandCodeChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            commandCode: value
        }));
    }

    handleManufacturingOrderCodeChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            manufacturingOrderCode: value
        }))
    }

    handleSalesOrderCodeChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            salesOrderCode: value
        }))
    }

    handleProgressChange = (value) => {
        this.setState((state) => ({
            ...state,
            progress: value
        }))
    }

    render() {
        const { translate, manufacturingPlan } = this.props;
        let listPlans = [];
        if (manufacturingPlan.listPlans && manufacturingPlan.isLoading === false) {
            listPlans = manufacturingPlan.listPlans;
        }
        const { code, startDate, endDate, createdAt, commandCode, manufacturingOrderCode, salesOrderCode } = this.state;
        const { totalPages, page } = manufacturingPlan;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <NewPlanCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.code')}</label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} placeholder="KH202012212" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.start_date')}</label>
                            <DatePicker
                                id={`start-date-manufacturing-plan`}
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>


                    </div>
                    <div className="form-inline">
                        {/* <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.manufacturing_order_code')}</label>
                            <input type="text" className="form-control" value={manufacturingOrderCode} onChange={this.handleManufacturingOrderCodeChange} placeholder="DSX202012242" autoComplete="off" />
                        </div> */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.sales_order_code')}</label>
                            <input type="text" className="form-control" value={salesOrderCode} onChange={this.handleSalesOrderCodeChange} placeholder="DKD202012223" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.end_date')}</label>
                            <DatePicker
                                id={`end-date-manufacturing-plan`}
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.command_code')}</label>
                            <input type="text" className="form-control" value={commandCode} onChange={this.handleCommandCodeChange} placeholder="LSX202012224" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.created_at')}</label>
                            <DatePicker
                                id={`createdAt-manufacturing-plan`}
                                value={createdAt}
                                onChange={this.handleCreatedAtChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.works')}</label>
                            <SelectMulti
                                id={`select-multi-works`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.plan.choose_works'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={this.getListManufacturingWorksArr()}
                                onChange={this.handleManufacturingWorksChange}
                            />
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
                                    { value: '1', text: translate('manufacturing.plan.1.content') },
                                    { value: '2', text: translate('manufacturing.plan.2.content') },
                                    { value: '3', text: translate('manufacturing.plan.3.content') },
                                    { value: '4', text: translate('manufacturing.plan.4.content') },
                                    { value: '5', text: translate('manufacturing.plan.5.content') },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>

                    </div>

                    <div className="form-inline">

                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.plan.progess')}</label>
                            <SelectMulti
                                id={`select-multi-progress-plan`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.plan.choose_progess'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manufacturing.plan.progress_1') },
                                    { value: '2', text: translate('manufacturing.plan.progress_2') },
                                    { value: '3', text: translate('manufacturing.plan.progress_3') },
                                ]}
                                onChange={this.handleProgressChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static"></label>
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
                                            <a style={{ width: '5px' }} title={translate('manufacturing.purchasing_request.purchasing_request_detail')} onClick={() => { this.handleShowDetailPurchasingRequest(plan) }}><i className="material-icons">view_list</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa kế hoạch sản xuất"><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {manufacturingPlan.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listPlans === 'undefined' || listPlans.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingPlan, auth, manufacturingWorks } = state;
    return { manufacturingPlan, auth, manufacturingWorks };
}

const mapDispatchToProps = {
    getAllManufacturingPlans: manufacturingPlanActions.getAllManufacturingPlans,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingPlanManagementTable));