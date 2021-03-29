import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';
import { DataTableSetting, SelectBox, SelectMulti } from '../../../../common-components';

CareHistoriesInfoForm.propTypes = {

};

function CareHistoriesInfoForm(props) {


    const { id } = props;
    return (
        <div className="tab-pane purchaseHistories" id={id}>
            <div className="box">
                <div className="box-body qlcv">
                    {/* search form */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>

                        <div className="form-group" >
                            <label>{'Loại hoạt động'}</label>
                            {
                                <SelectMulti id="multiSelectUnit12"
                                    items={['']}
                                    //   onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: "Loại hoạt động", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label>{'Trạng thái '}</label>
                            {

                                <SelectMulti id="multiSelectUnit13"
                                    items={['']}
                                    //   onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: "Trạng thái ", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }

                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Người phụ trách</label>
                            <input className="form-control" type="text" name="customerCode" oplaceholder={`Người phụ trách`} />
                        </div>

                        <div className="form-group" >
                            <label>Tìm kiếm</label>
                            <button type="button" className="btn btn-success"
                            //onClick={this.search} 
                            >{'Tìm kiếm'}</button>
                        </div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id={1} style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>{'Loại hoạt động'}</th>
                                <th>{'Tên hoạt động'}</th>
                                <th>{'Mô tả'}</th>
                                <th>{'Người phụ trách'}</th>
                                <th>{'Thời gian thực hiện'}</th>
                                <th>{'Trạng thái'}</th>
                                <th>{'Đánh giá'}</th>
                                <th style={{ width: "120px" }}>
                                    {'Hành động'}
                                    <DataTableSetting
                                        columnArr={[
                                            ('Loại hoạt động'),
                                            ('Tên hoạt động'),
                                            ('Mô tả'),
                                            ('Người phụ trách'),
                                            ('Thời gian thực hiện'),
                                            ('Trạng thái'),
                                            ('Đánh giá')
                                        ]}
                                    // setLimit={this.setLimit}
                                    //  tableId={tableId}
                                    />
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <td>Gọi điện thoại</td>
                            <td>Gọi điện chào mời sản phẩm mới</td>
                            <td>Gọi điện chào mời sản phẩm mới</td>
                            <td>Nguyễn Văn Thái</td>
                            <td>10:00 19/03/2021 đến 10:00 21/03/2021</td>
                            <td>Đang thực hiện</td>
                            <td></td>
                            <td style={{ textAlign: 'center' }}>
                                <a className="text-green" ><i className="material-icons">visibility</i></a>
                            </td>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default connect(null, null)(withTranslate(CareHistoriesInfoForm));