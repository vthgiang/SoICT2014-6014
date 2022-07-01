import { connect } from 'react-redux';
import React, { Component, useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { ApiImage, ContentMaker, DateTimeConverter, DialogModal, ErrorLabel, SelectBox, ShowMoreShowLess } from '../../../../common-components';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { AuthActions } from '../../../auth/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { TaskFormValidator } from './taskFormValidator';

function ModalProposalPresonnel(props) {
    const [formula, setFormula] = useState("40 + averagePoint*0.3 + (100 - 5* numberOfTaskInprocess)*0.3");
    const { newTask } = props
    const { organizationalUnit, collaboratedWithOrganizationalUnits, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees } = newTask;
    const { tasks } = props;
    const [state, setState] = useState({
        errorOnFormula: undefined,

    });
    const { errorOnFormula } = state;
    const handleChangeFormula = (event) => {
        let value = event.target.value;
        validateFormula(value, true);
    }

    const validateFormula = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateFormula(value);

        if (value === "") {
            msg = "Không được để trống";
        }
        if (willUpdateState) {
            setFormula(value)
            setState({
                ...state,
                errorOnFormula: msg,
            });
        }
        return msg === undefined;
    }

    const handleChangeRoleTask = (value, userId) => {
        if (value == 1) {
            const newResponsibleEmployees = [...responsibleEmployees, userId]
            props.handleChangeTaskResponsibleEmployees(newResponsibleEmployees)
        }
        if (value == 2) {
            const newAccountableEmployees = [...accountableEmployees, userId]
            props.handleChangeTaskAccountableEmployees([newAccountableEmployees])
        }
        if (value == 3) {
            const newConsultedEmployees = [...consultedEmployees, userId]
            props.handleChangeTaskConsultedEmployees([newConsultedEmployees])
        }
        if (value == 4) {
            const newInformedEmployees = [...informedEmployees, userId]
            props.handleChangeTaskInformedEmployees([newInformedEmployees])
        }
    }

    useEffect(() => {
        props.proposalPersonnel({
            unitIds: [organizationalUnit, ...collaboratedWithOrganizationalUnits],
            formula: formula
        })
    }, [])

    console.log(47, tasks?.proposalPersonnel)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-proposal-presonnel`}
                title={`Đề xuất nhân sự công việc`}
                formID={`modal-proposal-presonnel`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className={` form-group ${errorOnFormula === undefined ? "" : "has-error"}`} >
                    <label className="control-label" htmlFor="inputFormula">Công thức tính điểm đề xuất<span className="text-red">*</span></label>
                    <div style={{ display: "flex" }}>
                        <input type="text" className="form-control" id="inputFormula" placeholder="averagePoint - 10 * numberOfTaskInprocess"
                            value={formula} onChange={handleChangeFormula}
                        />
                        <button className="btn btn-success" onClick={() => {
                            props.proposalPersonnel({
                                unitIds: [organizationalUnit, ...collaboratedWithOrganizationalUnits],
                                formula: formula
                            })
                        }}>Thay đổi</button>
                    </div>
                    <ErrorLabel content={errorOnFormula} />
                    <br />
                    <div><span style={{ fontWeight: 800 }}>Ví dụ 1: </span>averagePoint - 10 * numberOfTaskInprocess</div>
                    <div><span style={{ fontWeight: 800 }}>Ví dụ 2: </span>averagePoint/numberOfTaskNotEvaluated - 5 * numberOfTaskInprocess</div>
                    <br />
                    <div><span style={{ fontWeight: 600 }}>averagePoint</span> - Điểm trung bình các công việc kết thúc đã được đánh giá</div>
                    <div><span style={{ fontWeight: 600 }}>numberOfTaskInprocess</span> - Số lượng công việc đang tham gia</div>
                    <div><span style={{ fontWeight: 600 }}>numberOfTaskNotEvaluated</span> - Công việc kết thúc chưa được đánh giá</div>
                </div>
                <div>
                    <table id="proposal-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>STT</th>
                                <th>Tên</th>
                                <th>Điểm đề xuất</th>
                                <th style={{ textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(tasks && tasks.proposalPersonnel?.length !== 0) &&
                                tasks.proposalPersonnel?.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.user.name}</td>
                                        <td>{parseFloat(x.point).toFixed(2)}</td>
                                        <td>
                                            <SelectBox
                                                id={`select-RACI-${x.user._id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={[
                                                    { value: 0, text: "Chọn vai trò RACI" },
                                                    { value: 1, text: "Người thực hiện" },
                                                    { value: 2, text: "Người phê duyệt" },
                                                    { value: 3, text: "Người tư vấn" },
                                                    { value: 4, text: "Người quan sát" }
                                                ]}
                                                onChange={(value) => handleChangeRoleTask(value, x.user._id)}
                                                multiple={false}
                                            // value={value.type}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                </div>
            </DialogModal >
        </React.Fragment >
    );
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionCreators = {
    proposalPersonnel: taskManagementActions.proposalPersonnel,
};

const connectedTask = connect(mapState, actionCreators)(withTranslate(ModalProposalPresonnel));

export { connectedTask as ModalProposalPresonnel };

