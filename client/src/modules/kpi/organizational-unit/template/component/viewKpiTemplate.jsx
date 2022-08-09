import parse from 'html-react-parser';
import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { kpiTemplateActions } from '../redux/actions';

const ViewKpiTemplate = (props) => {
    const { kpiTemplate } = props;
    return (
        <React.Fragment>

            {/**Form chứa các thông tin của 1 kpi template */}

            <div className="row" style={{ padding: "0 20px" }}>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Thông tin chung</legend>
                    <div className="row">
                        {/**Tên mẫu KPI */}
                        <div className={` col-sm-6 form-inline`} >
                            <label className="control-label">Tên mẫu KPI: </label>
                            <span style={{ marginLeft: 10 }}>
                                {kpiTemplate?.name}
                            </span>
                        </div>

                        {/**Đơn vị(phòng ban) của Kpi template*/}
                        <div className={`col-sm-6 form-group`} style={{ marginLeft: 0, marginRight: 0 }}>
                            <label className="control-label">Đơn vị quản lý: </label>
                            <span style={{ marginLeft: 10 }}>
                                {kpiTemplate?.organizationalUnit?.name}
                            </span>
                        </div>
                    </div>

                    <div className="row">
                        {/**Mô tả **/}
                        <div className={`col-sm-6 form-group`} style={{ marginLeft: 0, marginRight: 0 }}>
                            <label className="control-label">Mô tả: </label>
                            <span style={{ marginLeft: 10, display: "inline-block" }}>
                                {parse(kpiTemplate?.description ?? "")}
                            </span>
                        </div>
                    </div>


                    {/* Mô tả kpi */}
                    {/* <div >
                        <div className={`form-group`}>
                            <label className="control-label" style={{ marginRight: 10 }}>Mô tả</label>
                            <QuillEditor
                                id={`kpi-template-view-modal-quill`}
                                table={false}
                                embeds={false}
                                getTextData={() => { }}
                                maxHeight={80}
                                quillValueDefault={kpiTemplate?.description}
                                placeholder={"Mô tả"}
                            />
                        </div>
                    </div> */}
                </fieldset>
            </div>

            <div className="row" style={{ padding: "0 20px" }}>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Danh sách mục tiêu</legend>


                    {/**Table chứa các mục tiêu sẵn có*/}
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }} className="col-fixed">STT</th>
                                <th title="Tên mục tiêu">Tên</th>
                                <th title="Trọng số">Trọng số</th>
                                <th title="Chỉ tiêu">Chỉ tiêu</th>
                                <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                            </tr>
                        </thead>

                        <tbody>
                            {kpiTemplate?.kpis.map((item, index) =>
                                <tr className="" key={`_${index}`}>
                                    <td >{index + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.weight}</td>
                                    <td>{item?.target ? `${item?.target} (${item?.unit})` : "N/A"}</td>
                                    <td>{item?.criteria}</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </fieldset>
            </div>

        </React.Fragment>
    );
}

function mapState(state) {
    const { kpitemplates, department } = state;
    return { kpitemplates, department };
}

const actionCreators = {
    getKpiTemplate: kpiTemplateActions.getKpiTemplateById,
};
const connectedViewKpiTemplate = connect(mapState, actionCreators)(withTranslate(ViewKpiTemplate));
export { connectedViewKpiTemplate as ViewKpiTemplate };
