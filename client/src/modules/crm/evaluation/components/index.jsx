import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar } from '../../../../common-components';
import EvaluationInfoForm from './evaluationInfoForm';
import { connect } from 'react-redux';
import { CrmEvaluationActions } from '../redux/action';

Evaluation.propTypes = {

};

function Evaluation(props) {
    const { translate, crm } = props


    // handle xem chi tiet đánh giá
    const handleEvaluationInfo = async (evaluation) => {
        await setEvaluationInfo(evaluation);
        window.$('#modal-crm-evaluation-info').modal('show');
    }
    //lay thoi gian hien tai
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    //lay list danh gia nhan vien theo thang hien tai
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        props.getEvaluations({ month, year });
       
    }, [])


    //-------------------
    const [evaluationInfo, setEvaluationInfo] = useState();
    const { evaluations } = crm
    const [time, setTime] = useState(`${month + 1}-${year}`);
    const changeTime = async (value) => {
        await setTime(value);
        if (value) {
            let dataTime = value.split("-");
            let month = dataTime[0];
            let year = dataTime[1];
            console.log('ham handle', month, year)
            props.getEvaluations({ month, year });
        }
    }
    return (
        <div className="box">

            <div className="box-body qlcv ">
                {/* Modal xem chi tiết  */}
                {evaluationInfo && <EvaluationInfoForm evaluationInfo={evaluationInfo} />}
                <div className="form-group" style={{ display: "flex", alignItems: 'center' }}>
                    <label style={{ margin: '2px 10px' }}>Tháng</label>
                    <DatePicker
                        id="time-sheet-log"
                        dateFormat="month-year"
                        value={time}
                        onChange={changeTime}
                        disabled={false}
                    />
                </div>
                <table className="table table-hover table-striped table-bordered" style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th>Mã nhân viên</th>
                            <th>Tên nhân viên</th>
                            <th>Tổng số hoạt động</th>
                            <th>Số hoạt động hoàn thành</th>
                            <th>Tỉ lệ thành công </th>
                            <th>Điểm đánh giá trung bình</th>
                            <th style={{ width: "120px" }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        'Mã nhân viên',
                                        "Tên nhân viên",
                                        'Tổng số hoạt động',
                                        'Số hoạt động hoàn thành',
                                        'Tỉ lệ thành công',
                                        'Điểm đánh giá trung bình'
                                    ]}
                                // setLimit={this.setLimit}
                                //  tableId={tableId}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            evaluations && evaluations.list && evaluations.list.map((evaluation) => (
                                <tr key={evaluation.staffCode} >
                                    <td>{evaluation.staffCode}</td>
                                    <td>{evaluation.staffName}</td>
                                    <td>{evaluation.totalCare}</td>
                                    <td>{evaluation.numberOfCompletedCares}</td>
                                    <td>{`${evaluation.successRate * 100} %`}</td>
                                    <td>{`${evaluation.averagePoint} /10`}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a className="text-yellow"
                                            onClick={() => handleEvaluationInfo(evaluation)}
                                        ><i className="material-icons">visibility</i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                {/* <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} /> */}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getEvaluations: CrmEvaluationActions.getEvaluations,


}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Evaluation));