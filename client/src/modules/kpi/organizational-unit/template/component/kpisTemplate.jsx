import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function KpisForm(props) {

    let EMPTY_ACTION = {
        name: '',
        description: '',
        mandatory: true,
    };

    const [state, setState] = useState({
        EMPTY_ACTION: Object.assign({}, EMPTY_ACTION),
        editAction: false,
        action: Object.assign({}, EMPTY_ACTION),
        quillValueDefault: null,
        kpiActions: []
    })



    const { translate } = props;
    let { action, kpiActions, quillValueDefault } = state;
    const { type } = props;

    return (
        /**Form chứa các thông tin của phần hoạt động của 1 kpi-template*/
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sach muc tieu</legend>

            {/**ten muc tieu */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Ten muc tieu</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**tieu chi danh gia */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Tieu chi danh gia</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**Trong so */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Trong so</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**Chi tieu */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Chỉ tiêu</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**Dơn vi */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Dơn vi đo</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**Tu khoa */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Tu khoa</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>

            {/**Cong thuc */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">Cong thuc</label>
                <input type="text" className="form-control" placeholder={2} value={""} onChange={() => { }} />
            </div>




            {/**Các button thêm 1 hoạt động, xóa trắng các trường thông tin đã nhập*/}
            <div className="pull-right" style={{ marginBottom: '10px' }}>
                {state.editAction ?
                    <React.Fragment>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => { }}>2</button>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => { }}>2</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => { }}>2</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={() => { }}>2</button>
            </div>

            {/**Table chứa các hoạt động sẵn có*/}
            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} className="col-fixed">STT</th>
                        <th title="Tên hoạt động">ten</th>
                        <th title="Mô tả">2</th>
                        <th style={{ width: '60px' }} title="Bắt buộc">2</th>
                        <th style={{ width: '60px' }} title="Hành động">2</th>
                    </tr>
                </thead>

                {
                    (typeof kpiActions === 'undefined' || kpiActions.length === 0) ? <tr><td colSpan={5}><center>{"Nodata"}</center></td></tr> :
                        // <ReactSortable animation={500} tag="tbody" id="actions" list={kpiActions} setList={(newState) => setState({...state, kpiActions: newState })}>
                        // <ReactSortable animation={500} tag="tbody" id="actions" list={kpiActions} setList={(newState) => { props.onDataChange(newState); setState({ ...state, kpiActions: newState }) }}>
                        //     {kpiActions.map((item, index) =>
                        //         <tr className="" key={`${state.keyPrefix}_${index}`}>
                        //             <td >{index + 1}</td>
                        //             <td>{parse(item.name)}</td>
                        //             <td>{parse(item.description)}</td>
                        //             <td >{item.mandatory ? "Có" : "Không"}</td>
                        //             {/**các button sửa, xóa 1 hoạt động */}
                        //             <td >
                        //                 <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEditAction(item, index)}><i className="material-icons"></i></a>
                        //                 <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteAction(index)}><i className="material-icons"></i></a>
                        //             </td>
                        //         </tr>
                        //     )}
                        // </ReactSortable>
                        <div>Bang</div>

                }
            </table>
        </fieldset>
    )
}

const actionForm = connect()(withTranslate(KpisForm));
export { actionForm as KpisForm };
