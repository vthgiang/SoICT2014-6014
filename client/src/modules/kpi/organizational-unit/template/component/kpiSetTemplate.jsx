import React from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting } from "../../../../../common-components";
import { ModalAddKpiTemplate } from "./addKpiTemplateModal";

const TemplateKpi = () => {
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body qlcv" id="table-kpi-template">
                    <ModalAddKpiTemplate />
                    <div className="form-inline">
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <a className="btn btn-success pull-right" data-toggle="modal" data-target="#modal-add-kpi-template" data-backdrop="static" data-keyboard="false" title='Thêm'>Thêm mới</a>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Tên mẫu</label>
                            <input className="form-control" type="text" placeholder="Tìm theo tên" onChange={() => { }} />
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Đơn vị quản lý</label>
                            {/* {units &&
                                <SelectMulti id="multiSelectUnit"
                                    defaultValue={units.map(item => { return item._id })}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    options={{
                                        nonSelectedText: translate('kpi_template.select_all_units'),
                                        allSelectedText: translate(`kpi.kpi_management.select_all_department`),
                                    }}>
                                </SelectMulti>
                            } */}
                        </div>
                    </div>

                    <DataTableSetting
                        tableId={'kpi-set-template'}
                        columnArr={[
                            'Tên mẫu KPI',
                            'Đơn vị',
                            'Mô tả',
                            'Số lần sử dụng',
                            'Người tạo mẫu',
                        ]}
                    // setLimit={this.setLimit}
                    />

                    {/**Table chứa các mẫu công việc trong 1 trang */}
                    <table className="table table-bordered table-striped table-hover" id={'kpi-set-template'}>
                        <thead>
                            <tr>
                                <th title='Tên mẫu KPI'>Tên mẫu KPI</th>
                                <th title="Đơn vị">Đơn vị</th>
                                <th title="Mô tả">Mô tả</th>
                                <th title="Số lần sử dụng">Số lần sử dụng</th>
                                <th title="Người tạo mẫu">Người tạo mẫu</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        {/* <tbody className="kpi-table">
                            {
                                (typeof listKpiTemplates !== 'undefined' && listKpiTemplates.length !== 0) ?
                                    listKpiTemplates.map(item => item &&
                                        <tr key={item?._id}>
                                            <td title={item?.name}>{item?.name}</td>
                                            <td title={item?.description}>{parse(item?.description ? item.description : "")}</td>
                                            <td title={item?.numberOfUse}>{item?.numberOfUse}</td>
                                            <td title={item?.creator?.name}>{item?.creator?.name ? item.creator.name : translate('kpi.kpi_template.error_kpi_template_creator_null')}</td>
                                            <td title={item?.organizationalUnit?.name}>{item?.organizationalUnit?.name ? item.organizationalUnit.name : translate('kpi_template.error_kpi_template_organizational_unit_null')}</td>
                                            <td>
                                                <a href="#abc" onClick={() => this.handleView(item?._id)} title={translate('kpi.kpi_template.view_detail_of_this_kpi_template')}>
                                                    <i className="material-icons" >view_list</i>
                                                </a>

                                                {this.checkPermisson(item?.organizationalUnit?.managers, item?.creator?._id) &&
                                                    <React.Fragment>
                                                        <a href="cursor:{'pointer'}" onClick={() => this.handleEdit(item)} className="edit" title={translate('kpi_template.edit_this_kpi_template')}>
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a href="cursor:{'pointer'}" onClick={() => this.handleDelete(item?._id, item?.numberOfUse)} className="delete" title={translate('kpi_template.delete_this_kpi_template')}>
                                                            <i className="material-icons"></i>
                                                        </a>
                                                    </React.Fragment>
                                                }
                                            </td>
                                        </tr>
                                    ) : null
                            }
                        </tbody> */}
                    </table>
                    {/* {(listKpiTemplates && listKpiTemplates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage} /> */}
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { } = state;
    return {};
}

const action = {
};

const connectedTemplateKpi = connect(mapState, action)(withTranslate(TemplateKpi));
export default connectedTemplateKpi;
