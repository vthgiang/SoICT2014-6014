import React from 'react';
import PropTypes from 'prop-types';
import { DataTableSetting, ExportExcel, PaginateBar, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import CreateCareCommonForm from '../../common/createCareCommonForm';

LoyalCustomer.propTypes = {

};

function LoyalCustomer(props) {
    const { translate } = props;

const  handleCreateCareAcrion = () => {
    console.log('vao day')
    window.$('#modal-crm-care-common-create').modal('show')
}

    return (
        <div className="box">
            <div className="box-body qlcv">
                <CreateCareCommonForm type={1} />
                <div className="form-inline">
                    {/* export excel danh sách khách hàng */}
                    <ExportExcel id="export-customer" buttonName={translate('human_resource.name_button_export')}
                        //exportData={exportData}
                        style={{ marginTop: 0 }} />

                </div>
                {/* search form */}
                <div className="form-inline" >
                    <div className="form-group unitSearch">
                        <label>{"Xếp hạng khách hàng"}</label>
                        <SelectBox id="SelectUnit1"
                            defaultValue={''}
                            items={[
                                { value: '1', text: 'Vàng' },
                                { value: '2', text: 'Bạc' },
                                { value: '3', text: 'Đồng' },
                            ]}
                            //  onChange={this.handleSelectOrganizationalUnit}
                            style={{ width: '100%' }}
                        >
                        </SelectBox>
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{'Mã khách hàng'}</label>
                        <input className="form-control" type="text" name="customerCode" placeholder={`Mã khách hàng`} />
                    </div>
                </div>


                <div className="form-inline">
                    <div className="form-group" >
                        <label></label>
                        <button type="button" className="btn btn-success"
                            //  onClick={this.search} 
                            title={'Tìm kiếm'}>{'Tìm kiếm'}</button>
                    </div>

                </div>
                {/* Bảng hiển thị thông tin khách hàng thân thiết */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>

                            <th>{"Số thứ tự"}</th>
                            <th>{"Mã khách hàng"}</th>
                            <th>{"Tên khách hàng"}</th>
                            <th>{"Xếp hạng khách hàng"}</th>
                            <th>{"Điểm số"}</th>
                            <th>{"Tổng số đơn hàng"}</th>
                            <th>{"Tổng giá trị đơn hàng"}</th>

                            <th style={{ width: "120px" }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        'Số thứ tự',
                                        'Mã khách hàng',
                                        'Tên khách hàng',
                                        'Xếp hạng khách hàng',
                                        'Tổng số đơn hàng',
                                        'Tổng giá trị đơn hàng'
                                    ]}
                                    //limit={this.state.limit}
                                    //  setLimit={this.setLimit}
                                    tableId="table-manage-crm-group"
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {

                            <tr >

                                <td>001</td>
                                <td>KH1402</td>
                                <td>Nguyễn Văn Thái</td>
                                <td>Vàng</td>
                                <td>1402</td>
                                <td>12</td>
                                <td>10.000.000.000</td>
                                <td style={{ textAlign: 'center' }}>

                                    <a className="text-green"
                                     onClick={handleCreateCareAcrion}
                                    ><i className="material-icons">add_comment</i></a>
                                </td>
                            </tr>
                        }

                    </tbody>
                </table>
                {/* {
                    cares && cares.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        cares.list && cares.list.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>

                }
           
                {
                    <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} />
                } */}
            </div>
        </div>
    );
}

export default (withTranslate(LoyalCustomer));;