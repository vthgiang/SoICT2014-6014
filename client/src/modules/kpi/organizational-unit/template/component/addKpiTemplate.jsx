import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { QuillEditor, SelectBox } from '../../../../../common-components';
import { getStorage } from '../../../../../config';
// import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { KpisForm } from './kpisTemplate';

function AddKpiTemplate(props) {
    const { user } = props;
    let userId = getStorage("userId")

    const [state, setState] = useState({
        templateData: {
            organizationalUnit: '',
            name: '',
            description: '',
            descriptionDefault: '',
            creator: userId,
            kpis: [],
        },
        showMore: props.isProcess ? false : true,
        currentRole: localStorage.getItem('currentRole'),
    })
    const { templateData } = state;
    const { descriptionDefault } = templateData;

    const handleChangeName = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            templateData: {
                ...state.templateData,
                name: value
            }
        })
        props.onChangeTemplateData(state.templateData);
    }

    const handleChangeUnit = (value) => {
        console.log('adu')
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            templateData: {
                ...state.templateData,
                organizationalUnit: value
            }
        })
        props.onChangeTemplateData(state.templateData);
    }
    const handleChangeDescription = (value, imgs) => {
        console.log(54, value)
        setState(state => {
            return {
                ...state,
                templateData: {
                    ...state.templateData,
                    description: value,
                }
            };
        });

        props.onChangeTemplateData(state.templateData);
    }

    const handleKpisChange = (data) => {
        let { templateData } = state;
        templateData.kpis = data;
        props.onChangeTemplateData(templateData);
        setState({
            ...state,
            templateData
        })
    }

    const { organizationalUnitsOfUser: unitArr } = user;

    return (
        <React.Fragment>

            {/**Form chứa các thông tin của 1 kpi template */}

            <div className="row" style={{ padding: "0 20px" }}>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Thông tin chung</legend>
                    <div className="row">
                        {/**Tên mẫu KPI */}
                        <div className={` col-sm-6 form-group ${state.templateData.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">Tên mẫu KPI <span style={{ color: "red" }}>*</span></label>
                            <input
                                type="Name"
                                className="form-control"
                                placeholder={"Tên mẫu KPI"}
                                value={templateData.name}
                                onChange={(e) => { handleChangeName(e) }}
                            />
                        </div>

                        {/**Đơn vị(phòng ban) của Kpi template*/}
                        <div className={`col-sm-6 form-group ${state.templateData.errorOnUnit === undefined ? "" : "has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                            <label className="control-label">Đơn vị quản lý</label>
                            {unitArr &&
                                <SelectBox
                                    id={`${props.savedKpiId}selectUnitInAddTemplateModal`}
                                    className="form-control select2"
                                    style={{ width: '100%' }}
                                    value={templateData?.organizationalUnit}
                                    onChange={handleChangeUnit}
                                    items={unitArr.map(item => { return { value: item._id, text: item.name } })}
                                    options={{
                                        nonSelectedText: "Chọn tất cả đơn vị",
                                        allSelectedText: "Chọn tất cả đơn vị",
                                    }}
                                    multiple={false}>
                                </SelectBox>
                            }
                        </div>
                    </div>


                    {/* Mô tả kpi */}
                    <div >
                        <div className={`form-group`}>
                            <label className="control-label">Mô tả</label>
                            <QuillEditor
                                id={`kpi-template-add-modal-quill`}
                                table={false}
                                embeds={false}
                                getTextData={handleChangeDescription}
                                maxHeight={80}
                                quillValueDefault={descriptionDefault}
                                placeholder={"Mô tả"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="row" style={{ padding: "0 20px" }}>
                {/**Các mục tiêu trong mẫu kpi */}
                <div >
                    <KpisForm initialData={templateData?.kpis} onDataChange={handleKpisChange} />
                </div>
            </div>

        </React.Fragment>
    );
}

function mapState(state) {
    const { kpitemplates, user } = state;
    return { kpitemplates, user };
}

const actionCreators = {
};
const connectedAddKpiTemplate = connect(mapState, actionCreators)(withTranslate(AddKpiTemplate));
export { connectedAddKpiTemplate as AddKpiTemplate };
