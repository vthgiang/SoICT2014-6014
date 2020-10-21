import React, { Component } from 'react';
import { ButtonModal, DatePicker, DialogModal, SelectBox, SelectMulti } from '../../../../../../../common-components';
import sampleData from '../../../../sampleData';
import PlanInfoForm from './planInfoForm';

class NewPlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "1",
            products: [],
            estimateClick: false
        };
    }

    handleChangeStatus = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    handleAddProduct = () => {
        this.setState((state) => {
            return {
                ...state,
                products: [
                    ...state.products,
                    {
                        _id: "4",
                        code: "TIF1222"
                    }
                ]

            }
        });
    }

    handleEstimateClick = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            estimateClick: !state.estimateClick
        }));
    }


    render() {
        const { products, status } = this.state;
        const { manufacturingOrders } = sampleData;
        let manufacturingOrder = manufacturingOrders[0];
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-new-plan" button_name="Tạo kế hoạch" title="Tạo kế hoạch sản xuất" />
                <DialogModal
                    modalID="modal-create-new-plan" isLoading={false}
                    formID="form-create-new-plan"
                    title="Tạo kế hoạch sản xuất"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={100}
                    maxWidth={500}
                >
                    <form id="form-create-new-plan">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="timeline">
                                <div className="timeline-progress" style={{ width: `(100/3)%` }}></div>
                                <div className="timeline-items">
                                    <div className={`timeline-item`}>
                                        <div className="timeline-contain">Nguyên vật liệu</div>
                                    </div>
                                    <div className={`timeline-item active`}>
                                        <div className="timeline-contain">Lệnh sản xuất</div>
                                    </div>
                                    <div className={`timeline-item`}>
                                        <div className="timeline-contain">Ca sản xuất</div>
                                    </div>
                                    <div className={`timeline-item`}>
                                        <div className="timeline-contain">Chọn nhân sự</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PlanInfoForm />
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

export default NewPlanCreateForm;