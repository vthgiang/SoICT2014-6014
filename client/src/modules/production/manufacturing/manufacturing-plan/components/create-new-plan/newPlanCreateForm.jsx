import React, { Component } from 'react';
import { ButtonModal, DialogModal } from '../../../../../../common-components';
import CommandCreateForm from './commandCreateForm';
import PlanInfoForm from './generalPlanInfoForm';
import MillScheduleBooking from './millScheduleBooking';
import WorkerBooking from './workerBooking';
import './planCreate.css';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { generateCode } from '../../../../../../helpers/generateCode';
import { salesOrderActions } from '../../../../order/sales-order/redux/actions';
import { manufacturingPlanActions } from '../../redux/actions';
import { GoodActions } from '../../../../common-production/good-management/redux/actions';
import { LotActions } from '../../../../warehouse/inventory-management/redux/actions';
import { isValidDate } from '@fullcalendar/react';
import { UserActions } from '../../../../../super-admin/user/redux/actions';

class NewPlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            steps: [{
                label: this.props.translate('manufacturing.plan.general_info'),
                active: true,
                disabled: false
            }, {
                label: this.props.translate('manufacturing.plan.command_info'),
                active: false,
                disabled: true
            }, {
                label: this.props.translate('manufacturing.plan.turn_info'),
                active: false,
                disabled: true
            }, {
                label: this.props.translate('manufacturing.plan.worker_info'),
                active: false,
                disabled: true
            }],

            code: '',
            salesOrders: [],
            startDate: '',
            endDate: '',
            description: '',
            goods: [],
            approvers: [],
            manufacturingCommands: [],
            // Danh sách list goods được tổng hợp từ các salesorder
            listGoodsSalesOrders: [],
            // Mảng chưa good, số lượng good chưa được nhập vào lệnh sản xuất
            listRemainingGoods: [],
        };
    }

    componentDidMount = () => {
        this.props.getAllSalesOrder();
        this.props.getAllUserOfCompany();
        const currentRole = localStorage.getItem("currentRole");
        this.props.getAllApproversOfPlan(currentRole);
        this.props.getGoodByManageWorkRole(currentRole);
    }

    setCurrentStep = async (e, step) => {
        e.preventDefault();
        let { steps } = this.state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    }

    handleClickCreate = () => {
        this.setState({
            code: generateCode('KHSX')
        });
    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value
        })
    }

    handleEndDateChange = (value) => {
        this.setState({
            endDate: value
        })
    }

    handleApproversChange = (value) => {
        this.setState({
            approvers: value
        })
    }

    handleDescriptionChange = (value) => {
        this.setState({
            description: value
        })
    }

    handleSalesOrderChange = (value) => {
        this.setState({
            salesOrders: value
        });
        const { salesOrder } = this.props;
        const { listSalesOrders } = salesOrder;
        let listOrders = [];
        if (listSalesOrders.length) {
            listOrders = listSalesOrders.filter(x => value.includes(x._id))
        }
        let goods = [];
        let goodIds = goods.map(x => x.good._id);
        for (let i = 0; i < listOrders.length; i++) {
            listOrders[i].goods.map(x => {
                if (!goodIds.includes(x.good._id)) {
                    goodIds.push(x.good._id);
                    goods.push({
                        good: x.good,
                        quantity: x.quantity
                    });
                } else {
                    goods[this.findIndex(goods, x.good._id)].quantity += Number(x.quantity);
                }
            })
        }
        if (goodIds.length) {
            this.props.getInventoryByGoodIds({
                array: goodIds
            });
        }
        this.setState({
            listGoodsSalesOrders: [...goods],
        })
    }

    findIndex = (array, id) => {
        let result = -1;
        array.map((x, index) => {
            if (x.good._id === id) {
                result = index;
            }
        });
        return result;
    }

    // Hàm xử lý thêm tất cả các good trong sales orders vào goods
    handleAddAllGood = () => {
        let { goods, listGoodsSalesOrders } = this.state;
        let goodIds = goods.map(x => x.good._id);
        for (let i = 0; i < listGoodsSalesOrders.length; i++) {
            let x = listGoodsSalesOrders[i];
            if (!goodIds.includes(x.good._id)) {
                goodIds.push(x.good._id);
                goods.push({ ...x });
            } else {
                goods[this.findIndex(goods, x.good._id)].quantity = Number(goods[this.findIndex(goods, x.good._id)].quantity);
                goods[this.findIndex(goods, x.good._id)].quantity += Number(x.quantity);
            }
        }
        this.setState({
            goods: [...goods],
            // State đánh dấu đã add tất cả các good của sales order để tạo KH => Không được sửa lại nữa
            addedAllGoods: true
        });
    }



    getListApproverIds = () => {
        const { manufacturingPlan } = this.props;
        let approvers = [];
        if (manufacturingPlan.listApprovers && manufacturingPlan.isLoading === false) {
            approvers = manufacturingPlan.listApprovers.map(x => x._id);
        }
        return approvers;
    }

    handleListGoodsChange = (goods) => {
        this.setState({
            goods: goods
        });
    }

    handleAddGood = (good) => {
        const { goods } = this.state;
        const goodIds = goods.map(x => x.good._id);
        if (!goodIds.includes(good.goodId)) {
            const { listGoodsByRole } = this.props.goods;
            const goodObject = listGoodsByRole.filter(x => x._id === good.goodId)[0];
            good.good = goodObject;
            goods.push(good);
        } else {
            goods[this.findIndex(goods, good.goodId)].quantity += Number(good.quantity)
        }
        this.setState((state) => ({
            ...state,
            goods: [...goods],

        }));
    }

    handleSaveEditGood = (good, indexEditting) => {
        // Do good.good cũ truyền sang vẫn của good.good cũ, nên nếu thay đổi tên mặt hàng phải cập nhật lại;
        const { listGoodsByRole } = this.props.goods;
        const goodObject = listGoodsByRole.filter(x => x._id === good.goodId)[0];
        good.good = goodObject;

        const { goods } = this.state;
        const goodIds = goods.map(x => x.good._id);
        if (!goodIds.includes(good.goodId)) {
            goods[indexEditting] = good;
        } else if (goods[indexEditting].good._id === good.goodId) {
            goods[indexEditting] = good;
        } else {
            goods[this.findIndex(goods, good.goodId)].quantity = Number(goods[this.findIndex(goods, good.goodId)].quantity);
            goods[this.findIndex(goods, good.goodId)].quantity += Number(good.quantity);
            goods.splice(indexEditting, 1);
        }
        this.setState((state) => ({
            ...state,
            goods: [...goods]
        }))
    }

    handleDeleteGood = (index) => {
        const { goods } = this.state;
        goods.splice(index, 1);
        this.setState((state) => ({
            ...state,
            goods: [...goods]
        }))
    }

    // Phần chia lệnh sản xuất

    handleChangeListCommands = (listCommands) => {
        this.setState((state) => ({
            ...state,
            manufacturingCommands: listCommands
        }))
    }






    static getDerivedStateFromProps = (props, state) => {
        if (state.salesOrders.length) {
            const { lots } = props;
            const { listInventories } = lots;
            const { listGoodsSalesOrders } = state;
            if (listInventories) {
                listInventories.map((x, index) => {
                    if (listGoodsSalesOrders[index]) {
                        listGoodsSalesOrders[index].inventory = x.inventory;
                    }
                })
            }
            return {
                ...state,
                listGoodsSalesOrders: listGoodsSalesOrders
            }
        }
        return null;
    }

    handleRemainingGoodsChange = (listRemainingGoods) => {
        this.setState((state) => ({
            ...state,
            listRemainingGoods: listRemainingGoods
        }))
    }

    // Check xem bước phân chia lệnh đã được validate hay chưa
    checkValidateListRemainingGoods = () => {
        const { listRemainingGoods } = this.state;
        if (listRemainingGoods.length === 0) {
            return false;
        }
        for (let i = 0; i < listRemainingGoods.length; i++) {
            if (listRemainingGoods[i].remainingQuantity > 0) {
                return false;
            }
        }
        return true;
    }

    isValidateStep = (index) => {
        if (index == 1) {
            if (this.state.goods.length === 0
                || this.state.startDate === ""
                || this.state.endDate === ""
                || this.state.approvers === undefined
            ) {
                return false;
            }
            return true
        }
        else if (index == 2) {
            if (this.state.goods.length === 0
                || this.state.startDate === ""
                || this.state.endDate === ""
                || !this.checkValidateListRemainingGoods()
            ) {
                return false;
            }
            return true
        }
        else if (index == 3) {

        }
    }

    render() {
        console.log(this.state);
        const { step, steps } = this.state;
        const { translate } = this.props;
        const { code, salesOrders, startDate, approvers, endDate, description, goods, listGoodsSalesOrders, addedAllGoods, manufacturingCommands } = this.state;
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-new-plan" button_name={translate('manufacturing.plan.create_plan')} title={translate('manufacturing.plan.create_plan_title')} />
                <DialogModal
                    modalID="modal-create-new-plan" isLoading={false}
                    formID="form-create-new-plan"
                    title={translate('manufacturing.plan.create_plan_title')}
                    msg_success={translate('manufacturing.plan.create_successfully')}
                    msg_faile={translate('manufacturing.plan.create_failed')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={100}
                    maxWidth={500}
                >
                    <form id="form-create-new-plan">
                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `${step * 100 / (steps.length - 1)}%` }}></div>
                            <div className="timeline-items">
                                {
                                    steps.map((item, index) => (
                                        <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
                                            <div className={`timeline-contain ${(!this.isValidateStep(index) && index > 0) ? 'disable-timeline-contain' : ''}`} onClick={(e) => this.setCurrentStep(e, index)}>{item.label}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            {
                                step === 0 && <PlanInfoForm
                                    code={code}
                                    salesOrders={salesOrders}
                                    startDate={startDate}
                                    endDate={endDate}
                                    approvers={approvers}
                                    description={description}
                                    listGoods={goods}
                                    listGoodsSalesOrders={listGoodsSalesOrders}
                                    addedAllGoods={addedAllGoods}
                                    onStartDateChange={this.handleStartDateChange}
                                    onEndDateChange={this.handleEndDateChange}
                                    onApproversChange={this.handleApproversChange}
                                    onDescriptionChange={this.handleDescriptionChange}
                                    onSalesOrdersChange={this.handleSalesOrderChange}
                                    onListGoodsChange={this.handleListGoodsChange}
                                    onAddAllGood={this.handleAddAllGood}
                                    onAddGood={this.handleAddGood}
                                    onSaveEditGood={this.handleSaveEditGood}
                                    onDeleteGood={this.handleDeleteGood}
                                />
                            }
                            {
                                step === 1 && <CommandCreateForm
                                    listGoods={goods}
                                    commandCode={generateCode("LSX")}
                                    approvers={this.getListApproverIds()}
                                    onChangeListCommands={this.handleChangeListCommands}
                                    manufacturingCommands={manufacturingCommands}
                                    onListRemainingGoodsChange={this.handleRemainingGoodsChange}
                                />
                            }
                            {
                                step === 2 && <MillScheduleBooking />
                            }
                            {
                                step === 3 && <WorkerBooking />
                            }
                        </div>
                        <div style={{ textAlign: "center" }}>
                            {`${step + 1} / ${steps.length}`}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { salesOrder, manufacturingPlan, lots, goods } = state;
    return { salesOrder, manufacturingPlan, lots, goods }
}

const mapDispatchToProps = {
    getAllSalesOrder: salesOrderActions.getAllSalesOrder,
    getAllApproversOfPlan: manufacturingPlanActions.getAllApproversOfPlan,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getGoodByManageWorkRole: GoodActions.getGoodByManageWorkRole
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(NewPlanCreateForm));
// export default NewPlanCreateForm;