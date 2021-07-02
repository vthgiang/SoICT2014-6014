import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import BookManagement from '../components-class/stock-book';
import ReceiptManagement from '../components-class/good-receipts';
import IssueManagement from '../components-class/good-issues';
import ReturnManagement from '../components-class/good-returns';
import RotateManagement from '../components-class/stock-rotate';
import TakeManagement from '../components-class/stock-takes';

import { BillActions } from '../redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions';
import { millActions } from '../../../manufacturing/manufacturing-mill/redux/actions';

class BillManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            limit: 5,
            page: 1,
            group: '',
        }
    }

    componentDidMount() {
        const { limit, page, currentRole } = this.state;
        this.props.getBillsByType({ page, limit, managementLocation: currentRole });
        this.props.getBillsByType({ managementLocation: currentRole });
        this.props.getAllStocks({ managementLocation: currentRole });
        this.props.getUser();
        this.props.getAllGoods();
        this.props.getCustomers();
        this.props.getAllManufacturingMills();
    }

    handleShowDetailInfo = async (id) => {
        await this.props.getDetailBill(id);
        window.$('#modal-detail-bill').modal('show');
    }

    handleEdit = async (bill) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: bill
            }
        })

        window.$('#modal-edit-bill').modal('show');
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            managementLocation: this.state.currentRole,
            page: page,
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: this.state.customer,
            supplier: this.state.supplier,
            toStock: this.state.toStock,
            creator: this.state.creator
        };
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
        }
        this.props.getBillsByType(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            managementLocation: this.state.currentRole,
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: this.state.customer,
            supplier: this.state.supplier,
            toStock: this.state.toStock,
            creator: this.state.creator
        };
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
        }
        this.props.getBillsByType(data);
    }

    handleStockChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
            }
        })
    }

    handleToStockChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                toStock: value
            }
        })
    }

    handleCreatorChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                creator: value
            }
        })
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                code: value
            }
        })
    }

    handleTypeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                type: value
            }
        })
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    handlePartnerChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                customer: value
            }
        })
    }

    handleSupplierChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                supplier: value
            }
        })
    }

    handleSubmitSearch = () => {
        let data = {
            page: '1',
            limit: this.state.limit,
            managementLocation: this.state.currentRole,
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: this.state.customer,
            supplier: this.state.supplier,
            toStock: this.state.toStock,
            creator: this.state.creator
        }
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
        }
        this.props.getBillsByType(data);
    }

    handleChangeStartDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                startDate: value
            }
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                endDate: value
            }
        });
    }

    handleStockBook = async () => {
        const page = 1;
        const group = '';
        await this.setState(state => {
            return {
                ...state,
                page: page,
                group: group
            }
        })
        const { limit } = this.state;
        await this.props.getBillsByType({ page, limit, managementLocation: this.state.currentRole })
    }

    handleGoodReceipt = async () => {
        const page = 1;
        const group = '1';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group, managementLocation: this.state.currentRole })
    }

    handleGoodIssue = async () => {
        const page = 1;
        const group = '2';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group, managementLocation: this.state.currentRole })
    }

    handleGoodReturn = async () => {
        const page = 1;
        const group = '3';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group, managementLocation: this.state.currentRole })
    }

    handleStockTake = async () => {
        const page = 1;
        const group = '4';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group, managementLocation: this.state.currentRole })
    }

    handleStockRotate = async () => {
        const page = 1;
        const group = '5';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group, managementLocation: this.state.currentRole })
    }

    getPartner = () => {
        const { crm } = this.props;
        let partnerArr = [];

        crm.customers.list.map(item => {
            partnerArr.push({
                value: item._id,
                text: item.name
            })
        })

        return partnerArr;
    }

    checkRoleApprovers = (bill) => {
        const { approvers } = bill;
        const userId = localStorage.getItem("userId");
        let approverIds = approvers.map(x => x.approver._id);
        if (approverIds.includes(userId) && approvers[approverIds.indexOf(userId)].approvedTime === null) {
            return true;
        }
        return false
    }

    handleFinishedApproval = (bill) => {
        const userId = localStorage.getItem("userId");
        const data = {
            approverId: userId
        }
        this.props.editBill(bill._id, data);
    }

    checkRoleQualityControlStaffs = (bill) => {
        const { qualityControlStaffs } = bill;
        const userId = localStorage.getItem("userId");
        let qualityControlStaffId = qualityControlStaffs.map(x => x.staff._id);
        if (qualityControlStaffId.includes(userId) && qualityControlStaffs[qualityControlStaffId.indexOf(userId)].time === null) {
            return true;
        }
        return false
    }

    handleFinishedQualityControlStaff = (bill) => {
        const userId = localStorage.getItem("userId");
        const data = {
            qualityControlStaffId: userId
        }
        this.props.editBill(bill._id, data);
    }

    checkRoleCanEdit = (bill) => {
        const { responsibles, accountables, creator } = bill;
        const userId = localStorage.getItem("userId");
        let staffId = [];
        if(responsibles.length > 0) {
            responsibles.map(x => {
                staffId.push(x._id)
            })
        }
        if(accountables.length > 0) {
            accountables.map(x => {
                staffId.push(x._id)
            })
        }
        if(creator) {
                staffId.push(creator._id)
        }
        if (staffId.includes(userId)) {
            return true;
        }
        return false
    }

    render() {

        const { translate, bills, stocks} = this.props;
        const { group } = this.state;

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#bill-stock-book" data-toggle="tab" onClick={() => this.handleStockBook()}>{translate('manage_warehouse.bill_management.stock_book')}</a></li>
                    <li><a href="#bill-good-receipts" data-toggle="tab" onClick={() => this.handleGoodReceipt()}>{translate('manage_warehouse.bill_management.good_receipt')}</a></li>
                    <li><a href="#bill-good-issues" data-toggle="tab" onClick={() => this.handleGoodIssue()}>{translate('manage_warehouse.bill_management.good_issue')}</a></li>
                    <li><a href="#bill-good-returns" data-toggle="tab" onClick={() => this.handleGoodReturn()}>{translate('manage_warehouse.bill_management.good_return')}</a></li>
                    <li><a href="#bill-stock-takes" data-toggle="tab" onClick={() => this.handleStockTake()}>{translate('manage_warehouse.bill_management.stock_take')}</a></li>
                    <li><a href="#bill-stock-rotates" data-toggle="tab" onClick={() => this.handleStockRotate()}>{translate('manage_warehouse.bill_management.stock_rotate')}</a></li>
                </ul>
                <div className="tab-content">

                { group === '' && 
                    <BookManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}

                    />
                }

                { group === '1' && 
                    <ReceiptManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handleSupplierChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                        checkRoleApprovers={this.checkRoleApprovers}
                        handleFinishedApproval={this.handleFinishedApproval}
                        checkRoleQualityControlStaffs={this.checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={this.handleFinishedQualityControlStaff}
                        checkRoleCanEdit={this.checkRoleCanEdit}

                    />
                }

                { group === '2' && 
                    <IssueManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                        checkRoleApprovers={this.checkRoleApprovers}
                        handleFinishedApproval={this.handleFinishedApproval}
                        checkRoleQualityControlStaffs={this.checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={this.handleFinishedQualityControlStaff}
                        checkRoleCanEdit={this.checkRoleCanEdit}
                    />
                }

                { group === '3' && 
                    <ReturnManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                        checkRoleApprovers={this.checkRoleApprovers}
                        handleFinishedApproval={this.handleFinishedApproval}
                        checkRoleQualityControlStaffs={this.checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={this.handleFinishedQualityControlStaff}
                        checkRoleCanEdit={this.checkRoleCanEdit}
                    />
                }

                { group === '4' &&
                    <TakeManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                        checkRoleApprovers={this.checkRoleApprovers}
                        handleFinishedApproval={this.handleFinishedApproval}
                        checkRoleQualityControlStaffs={this.checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={this.handleFinishedQualityControlStaff}
                        checkRoleCanEdit={this.checkRoleCanEdit}
                    />
                }

                { group === '5' && 
                    <RotateManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handleToStockChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                        checkRoleApprovers={this.checkRoleApprovers}
                        handleFinishedApproval={this.handleFinishedApproval}
                        checkRoleQualityControlStaffs={this.checkRoleQualityControlStaffs}
                        handleFinishedQualityControlStaff={this.handleFinishedQualityControlStaff}
                        checkRoleCanEdit={this.checkRoleCanEdit}
                    />
                }
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getBillsByType: BillActions.getBillsByType,
    getDetailBill: BillActions.getDetailBill,
    getAllStocks: StockActions.getAllStocks,
    getUser: UserActions.get,
    getAllGoods: GoodActions.getAllGoods,
    getCustomers: CrmCustomerActions.getCustomers,
    editBill: BillActions.editBill,
    getAllManufacturingMills: millActions.getAllManufacturingMills
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillManagement));
