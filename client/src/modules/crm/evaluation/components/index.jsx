import React from 'react';
import PropTypes from 'prop-types';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, PaginateBar } from '../../../../common-components';
import EvaluationInfoForm from './evaluationInfoForm';

Evaluation.propTypes = {

};


function Evaluation(props) {
    const { translate } = props
    // handle xem chi tiet đánh giá
    const handleEvaluationInfo =()=>{
        window.$('#modal-crm-evaluation-info').modal('show');
    }
    return (
        <div className="box">
           
            <div className="box-body qlcv ">
                {/* Modal xem chi tiết  */}
                 <EvaluationInfoForm />

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

                            <tr >
                                <td>NV001</td>
                                <td>Nguyễn Văn Thái</td>
                                <td>150</td>
                                <td>100</td>
                                <td>66.7%</td>
                                <td>75.3/100</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-yellow"
                                    onClick={handleEvaluationInfo}
                                    ><i className="material-icons">visibility</i></a>

                                </td>
                            </tr>

                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                {/* <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} /> */}
            </div>
        </div>
    );
}

export default withTranslate(Evaluation);