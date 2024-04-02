import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { useHistory } from "react-router-dom";
import { DialogModal } from "../../../../../common-components";
import { DeliveryActions } from '../redux/actions'
function SaveSolutionRouting (props) {

    const [state, setState] = useState({
        solution: props.solution,
        problemAssumption: props.problemAssumption,
        code: ""
    });
    const history = useHistory();

    const { code, solution, problemAssumption } = state;

    useEffect(() => {
        setState({
            ...state,
            solution: props.solution,
            problemAssumption: props.problemAssumption,
        });
    }, []);

    const handleChangeCodeSolution = (event) => {
        setState({
            ...state,
            code: event.target.value
        })
    }
    const removeRedundantSolutionData = (solution) => {
        let cleanSolution = solution;
        let journeys = solution.journeys;
        journeys.forEach((journey, index, originArray) => {
            let cleanOrders = journey.orders.map((order) => {
                return {
                    capacity: order.capacity,
                    code: order.code,
                    customer: order.customer,
                    dxCode: order.dxCode,
                    id: order.id,
                    orderCustomerDxCode: order.orderCustomerDxCode,
                    orderValue: order.orderValue,
                    productTypeNumber: order.productTypeNumber,
                    timeLoading: order.timeLoading,
                    timeService: order.timeService,
                    weight: order.timeService
                }
            })
            originArray[index].orders = cleanOrders;

        })

        return cleanSolution;
    }
    const save = () => {
        let removeRedundantSolutionData = solution;
        removeRedundantSolutionData.directions = null;
        let deliveryPlan = {
            solution: removeRedundantSolutionData,
            problemAssumption: problemAssumption,
            code: code
        }
        props.createDeliveryPlan(deliveryPlan);
        history.push("/transportation-list-journey");
    }
    return (
        <>
            <DialogModal
                modalID="modal-save-solution"
                formID="form-save-solution"
                isLoading={false}
                title="Lưu giải pháp"
                func={save}
                size={35}
                // disableSubmit={!isFormValidated()}
            >
                <div className="box-body">
                    <div className="form-group">
                        <label htmlFor="solution-code">Mã lộ trình</label>
                        <input type="text" className="form-control" id="solution-code" value={code} placeholder="Nhập mã gợi nhớ" onChange={handleChangeCodeSolution}/>
                    </div>
                </div>
            </DialogModal>
        </>
    );
}

const actions = {
    createDeliveryPlan: DeliveryActions.createDeliveryPlan,
}

export default connect(null, actions)(withTranslate(SaveSolutionRouting))