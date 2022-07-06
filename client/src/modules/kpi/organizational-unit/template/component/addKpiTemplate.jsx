import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { QuillEditor } from '../../../../../common-components';
import { getStorage } from '../../../../../config';
// import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { KpisForm } from './kpisTemplate';

function AddKpiTemplate(props) {

    let userId = getStorage("userId")

    const [state, setState] = useState({
        newTemplate: {
            organizationalUnit: '',
            name: '',
            readByEmployees: [],
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: [],
            description: '',
            creator: userId,
            numberOfDaysTaken: '',
            formula: '',
            priority: 3,
            kpiActions: [],
            kpiInformations: [],
        },
        showMore: props.isProcess ? false : true,
        currentRole: localStorage.getItem('currentRole'),
    })



    // handleKpiTemplateDesc = (e) => {
    //     let { value } = e.target;
    //     let { isProcess, translate } = props
    //     isProcess && props.handleChangeName(value);
    //     let { message } = ValidationHelper.validateName(translate, value, 1, 255);
    //     let { newTemplate } = state;
    //     newTemplate.description = value;
    //     newTemplate.errorDescription = message;
    //     props.onChangeTemplateData(newTemplate);
    //     setState({ newTemplate });
    // }

    return (
        <React.Fragment>

            {/**Form chứa các thông tin của 1 kpi template */}

            <div className="row" style={{ padding: "0 20px" }}>
                <div>
                    {/**Tên mẫu công việc */}
                    <div className={`form-group ${state.newTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Tên mẫu KPI <span style={{ color: "red" }}>*</span></label>
                        <input type="Name" className="form-control" placeholder={"Tên mẫu KPI"} value={'Ten'} onChange={() => { }} />
                        {/* <ErrorLabel content={state.newTemplate.errorOnName} /> */}
                    </div>

                    {/**Đơn vị(phòng ban) của Kpi template*/}
                    <div className={`form-group ${state.newTemplate.errorOnUnit === undefined ? "" : "has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                        <label className="control-label">Đơn vị quản lý</label>
                        {/* {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== "" &&
                            <SelectBox
                                id={`unit-select-box-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    usersInUnitsOfCompany.map(x => {
                                        return { value: x.id, text: x.department };
                                    })
                                }
                                value={newTemplate.organizationalUnit}
                                onChange={handleKpiTemplateUnit}
                                multiple={false}
                            />
                        } */}
                    </div>

                    {/* Mô tả công việc */}
                    <div >
                        <div className={`form-group`}>
                            <label className="control-label">{"Mo ta"}</label>
                            <QuillEditor
                                id={`kpi-template-add-modal-quill`}
                                table={false}
                                embeds={false}
                                getTextData={() => { }}
                                maxHeight={80}
                                quillValueDefault={"Mo ta"}
                                placeholder={"Mo ta"}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}

            <div className="row">
                {/**Các hoạt động trong mẫu công việc */}
                <div >
                    <KpisForm />
                </div>
            </div>

        </React.Fragment>
    );
}

function mapState(state) {
}

const actionCreators = {
};
const connectedAddKpiTemplate = connect(mapState, actionCreators)(withTranslate(AddKpiTemplate));
export { connectedAddKpiTemplate as AddKpiTemplate };
