import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ReactSortable } from 'react-sortablejs';

function KpisForm(props) {
    const { initialData } = props;

    let EMPTY_KPI = {
        name: '',
        criteria: '',
        weight: null,
        target: null,
        unit: '',
        formula: '',
        keys: {}
    };

    const [state, setState] = useState({
        EMPTY_KPI: Object.assign({}, EMPTY_KPI),
        editKpi: false,
        kpi: Object.assign({}, EMPTY_KPI),
        keylist: [],
        kpis: []
    })

    useEffect(() => {
        console.log(29, initialData);
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
        state.kpi.name = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiCriteria = (event) => {
        let value = event.target.value;
        state.kpi.criteria = value;
        setState(
            { ...state }
        );
    }

    const handleChangeKpiWeight = (event) => {
        let value = event.target.value;
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

    const handleChangeKpiFormula = (event) => {
        let value = event.target.value;
        state.kpi.formula = value;
        const keyInFormula = value.replace(/[^a-z A-Z]/g, '-').split('-').filter(i => i !== "");
        const keyArr = Array.from(new Set(keyInFormula));
        console.log(78, keyArr)
        state.keylist = keyArr;

        setState(
            { ...state }
        );
    }

    // useEffect(() => {

    //     const keyInFormula = state.kpi?.formula?.replace(/[^a-z A-Z]/g, '-').split('-').filter(i => i !== "");
    //     const keyArr = Array.from(new Set(keyInFormula));
    //     console.log(78, keyArr)
    //     setState({
    //         ...state,
    //         keylist: keyArr
    //     })

    // }, [state.kpi.formula])

    const handleChangeKpiKey = (event, item) => {
        let value = event.target.value;
        state.kpi.keys[item] = value;
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
        console.log("object");
        // event.preventDefault(); // Ngăn không submit
        setState(state => {
            return {
                ...state,
                kpi: Object.assign({}, EMPTY_KPI),
                keylist: []
            }
        })
        console.log("2");
    }

    /**Thêm 1 hoạt động */
    const handleAddKpi = (event) => {
        console.log("object");
        // event.preventDefault(); // Ngăn không submit
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


    const { translate } = props;
    let { kpi, kpis } = state;
    const { type } = props;

    return (
        /**Form chứa các thông tin của phần hoạt động của 1 kpi-template*/
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sách mục tiêu</legend>
            <div className="row">
                <div className='col-md-6'>
                    {/**ten muc tieu */}
                    <div className={`form-group ${state.kpi.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Tên mục tiêu</label>
                        <input type="text" className="form-control" placeholder={'Tên mục tiêu'} value={kpi.name} onChange={handleChangeKpiName} />
                    </div>

                    {/**Trong so */}
                    <div className={`form-group ${state.kpi.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Trọng số</label>
                        <input type="number" className="form-control" placeholder={"Trọng số"} value={kpi.weight} onChange={handleChangeKpiWeight} />
                    </div>

                    {/**tieu chi danh gia */}
                    <div className={`form-group ${state.kpi.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Tiêu chí đánh giá</label>
                        <input type="text" className="form-control" placeholder="Tiêu chí đánh giá" value={kpi.criteria} onChange={handleChangeKpiCriteria} />
                    </div>
                </div>

                <div className='col-md-6'>
                    {/**Chi tieu */}
                    <div className={`form-group ${state.kpi.errorOnName === undefined ? "" : "has-error"}`} >
                        <label className="control-label">Chỉ tiêu</label>
                        <input type="number" className="form-control" placeholder={"Chỉ tiêu"} value={kpi.target} onChange={handleChangeKpiTarget} />
                    </div>

                    {/**Dơn vi */}
                    <div className={`form-group ${state.kpi.errorOnName === undefined ? "" : "has-error"}`} >
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
                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleAddKpi}>Thêm</button>
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
                        <th title="Công thức">Công thức</th>
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
                                    <td>{item?.formula}</td>
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
