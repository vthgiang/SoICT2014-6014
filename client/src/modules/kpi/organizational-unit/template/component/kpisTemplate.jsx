import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ReactSortable } from 'react-sortablejs';
import { ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

function KpisForm(props) {
    const { initialData } = props;

    let EMPTY_KPI = {
        name: '',
        criteria: '',
        weight: '',
        target: '',
        unit: '',
        formula: '',
        keys: {}
    };

    const [state, setState] = useState({
        EMPTY_KPI: Object.assign({}, EMPTY_KPI),
        editKpi: false,
        kpi: Object.assign({}, EMPTY_KPI),
        keylist: [],
        kpis: [],
        validate: {}
    })

    useEffect(() => {
        setState({
            ...state,
            kpis: initialData
        })
    }, [initialData])

    /**Gửi truy vấn tạo 1 template mới */
    const handleSubmit = async (event) => {
        const { newTemplate } = state;
        props.addNewTemplate(newTemplate);
    }

    const handleChangeKpiName = (event) => {
        let value = event.target.value;
        let { status, message } = ValidationHelper.validateName(props.translate, value);

        if (!status) {
            state.validate.name = message
        } else {
            state.validate.name = undefined
        }

        state.kpi.name = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiCriteria = (event) => {
        let value = event.target.value;
        let { status, message } = ValidationHelper.validateName(props.translate, value);

        if (!status) {
            state.validate.criteria = message
        } else {
            state.validate.criteria = undefined
        }

        state.kpi.criteria = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiWeight = (event) => {
        let value = event.target.value;
        let { status, message } = ValidationHelper.validateNumberInput(props.translate, value);

        if (!status) {
            state.validate.weight = message
        }
        else {
            state.validate.weight = undefined
        }

        state.kpi.weight = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiTarget = (event) => {
        let value = event.target.value;
        state.kpi.target = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiUnit = (event) => {
        let value = event.target.value;
        state.kpi.unit = value;
        setState(
            { ...state }
        );
    }

    /** cancel editing an kpi*/
    const handleCancelEditKpi = (event) => {
        event.preventDefault(); // Ngăn không submit     
        setState(state => {
            return {
                ...state,
                editKpi: false,
                kpi: Object.assign({}, state.EMPTY_KPI),
                keylist: []
            }
        });
    }

    /**reset all data fields of kpi table */
    const handleClearKpi = (event) => {
        setState(state => {
            return {
                ...state,
                kpi: Object.assign({}, EMPTY_KPI),
                keylist: []
            }
        })
    }

    /**Thêm 1 hoạt động */
    const handleAddKpi = (event) => {
        let { kpis, kpi } = state;

        if (!kpis)
            kpis = [];
        const newKpis = [
            ...kpis,
            kpi,
        ]

        setState({
            ...state,
            kpis: newKpis,
            kpi: Object.assign({}, EMPTY_KPI),
            keylist: []
        });
        props.onDataChange(newKpis)
    }

    /** Sửa các thông tin của hành động */
    const handleEditKpi = (kpi, index) => {
        setState(state => {
            return {
                ...state,
                editKpi: true,
                indexKpi: index,
                kpi: { ...kpi }
            }
        });
    }

    /**Lưu sau khi chỉnh sửa thông tin hoạt động */
    const handleSaveEditedKpi = (event) => {
        event.preventDefault(); // Ngăn không submit

        let { indexKpi, kpis, kpi } = state;
        kpis[indexKpi] = kpi;

        setState({
            ...state,
            kpis,
            editKpi: false,
            kpi: state.EMPTY_KPI,
            keylist: []
        })
        props.onDataChange(kpis)
    }

    /**Xóa 1 hành động */
    const handleDeleteKpi = (index) => {
        let { kpis } = state;
        kpis.splice(index, 1);

        setState(state => {
            return {
                ...state,
                kpis
            }
        }, () => props.onDataChange(kpis))
    }

    const isValidated = () => {
        const { kpi, validate } = state;
        if (kpi.name && !validate.name && kpi.weight && !validate.weight && kpi.criteria && !validate.criteria) {
            return true;
        }
        return false
    }

    let { kpi, kpis } = state;

    return (
        /**Form chứa các thông tin của phần hoạt động của 1 kpi-template*/
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sách mục tiêu</legend>
            <div className="row">
                <div className='col-md-6'>
                    {/**ten muc tieu */}
                    <div className={`form-group ${state.validate.name === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Tên mục tiêu <span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" placeholder={'Tên mục tiêu'} value={kpi.name} onChange={handleChangeKpiName} />
                        <ErrorLabel content={state.validate.name} />
                    </div>

                    {/**Trong so */}
                    <div className={`form-group ${state.validate.weight === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Trọng số <span style={{ color: "red" }}>*</span></label>
                        <input type="number" max={100} min={0} className="form-control" placeholder={"Trọng số"} value={kpi.weight} onChange={handleChangeKpiWeight} />
                        <ErrorLabel content={state.validate.weight} />
                    </div>

                    {/**tieu chi danh gia */}
                    <div className={`form-group ${state.validate.criteria === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Tiêu chí đánh giá <span style={{ color: "red" }}>*</span></label>
                        <input type="text" className="form-control" placeholder="Tiêu chí đánh giá" value={kpi.criteria} onChange={handleChangeKpiCriteria} />
                        <ErrorLabel content={state.validate.criteria} />
                    </div>
                </div>

                <div className='col-md-6'>
                    {/**Chi tieu */}
                    <div className={`form-group`} >
                        <label className="control-label">Chỉ tiêu</label>
                        <input type="number" className="form-control" placeholder={"Chỉ tiêu"} value={kpi.target} onChange={handleChangeKpiTarget} />
                    </div>

                    {/**Dơn vi */}
                    <div className={`form-group`} >
                        <label className="control-label">Đơn vị đo</label>
                        <input type="text" className="form-control" placeholder={"Đơn vị đo"} value={kpi.unit} onChange={handleChangeKpiUnit} />
                    </div>


                    {/**Các button thêm 1 hoạt động, xóa trắng các trường thông tin đã nhập*/}
                    <div className="pull-right" style={{ marginBottom: '10px' }}>
                        {state.editKpi ?
                            <React.Fragment>
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleCancelEditKpi}>Hủy thay đổi</button>
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleSaveEditedKpi}>Lưu</button>
                            </React.Fragment> :
                            <button disabled={!isValidated()} className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleAddKpi}>Thêm</button>
                        }
                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearKpi}>Xóa trắng</button>
                    </div>
                </div>
            </div>

            {/**Table chứa các mục tiêu sẵn có*/}
            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} className="col-fixed">STT</th>
                        <th title="Tên mục tiêu">Tên</th>
                        <th title="Trọng số">Trọng số</th>
                        <th title="Chỉ tiêu">Chỉ tiêu</th>
                        <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                        {/* <th title="Công thức">Công thức</th> */}
                        <th style={{ width: '60px' }} title="Hành động">Hành động</th>
                    </tr>
                </thead>

                {
                    (typeof kpis === 'undefined' || kpis.length === 0) ? <tr><td colSpan={5}><center>{"Nodata"}</center></td></tr> :
                        // <ReactSortable animation={500} tag="tbody" id="kpis" list={kpis} setList={(newState) => setState({...state, kpis: newState })}>
                        <ReactSortable animation={500} tag="tbody" id="kpis" list={kpis} setList={(newState) => { props.onDataChange(newState); setState({ ...state, kpis: newState }) }}>
                            {kpis.map((item, index) =>
                                <tr className="" key={`${state.keyPrefix}_${index}`}>
                                    <td >{index + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.weight}</td>
                                    <td>{`${item?.target} (${item?.unit})`}</td>
                                    <td>{item?.criteria}</td>
                                    {/* <td>{item?.formula}</td> */}
                                    {/**các button sửa, xóa 1 hoạt động */}
                                    <td >
                                        <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => { handleEditKpi(item, index) }}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => { handleDeleteKpi(index) }}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )}
                        </ReactSortable>

                }
            </table>
        </fieldset>
    )
}

const kpiForm = connect()(withTranslate(KpisForm));
export { kpiForm as KpisForm };
