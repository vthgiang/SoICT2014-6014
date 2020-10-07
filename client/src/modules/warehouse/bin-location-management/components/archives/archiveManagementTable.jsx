import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar, SearchBar } from '../../../../../common-components';

import ArchiveDetailForm from './archiveDetailForm';

class ArchiveManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            option: 'code',
            value: ''
        }
    }

    handleEdit = async (categories) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: categories
            }
        });

        window.$('#modal-edit-category').modal('show');
    }

    handleShowDetailInfo = async () => {
        window.$('#modal-detail-archive-bin').modal('show');
    }

    render (){
        const { translate } = this.props;

        return (
                <div className="box-body qlcv">
                    <ArchiveDetailForm />
                    <SearchBar 
                        columns={[
                        { title: translate('manage_warehouse.category_management.code'), value: 'code' },
                        { title: translate('manage_warehouse.category_management.name'), value: 'name' },
                        { title: translate('manage_warehouse.category_management.type'), value: 'type' }
                        ]}
                        valueOption = {{ nonSelectedText: translate('manage_warehouse.category_management.choose_type'), allSelectedText: translate('manage_warehouse.category_management.all_type') }}
                        typeColumns={[
                            { value: "product", title: translate('manage_warehouse.category_management.product') }, 
                            { value: "material", title: translate('manage_warehouse.category_management.material') }, 
                            { value: "equipment", title: translate('manage_warehouse.category_management.equipment') },
                            { value: "asset", title: translate('manage_warehouse.category_management.asset')}
                            ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />

                    <table id="category-table" className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>{translate('manage_warehouse.bin_location_management.index')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.code')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.status')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.capacity')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.goods')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="category-table"
                                        columnArr={[
                                            translate('manage_warehouse.bin_location_management.index'),
                                            translate('manage_warehouse.bin_location_management.code'),
                                            translate('manage_warehouse.bin_location_management.status'),
                                            translate('manage_warehouse.bin_location_management.capacity'),
                                            translate('manage_warehouse.bin_location_management.contained'),
                                            translate('manage_warehouse.bin_location_management.goods'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>ST001-B1-T1-P101</td>
                                        <td>Đã đầy</td>
                                        <td>3 khối</td>
                                        <td>3 khối</td>
                                        <td>ĐƯỜNG ACESULFAME K</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                            <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data = "ST001-B1-T1-P101"
                                                func={this.props.deleteCategory}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>ST001-B1-T1-P102</td>
                                        <td>Còn trống</td>
                                        <td>3 khối</td>
                                        <td>1 khối</td>
                                        <td>ACID CITRIC MONO</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                            <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data = "ST001-B1-T1-P102"
                                                func={this.props.deleteCategory}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>ST001-B1-T1-P103</td>
                                        <td>Còn trống</td>
                                        <td>4 khối</td>
                                        <td>1 khối</td>
                                        <td>Jucca Nước</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                            <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data = "ST001-B1-T1-P102"
                                                func={this.props.deleteCategory}
                                            />
                                        </td>
                                    </tr>
                        </tbody>
                    </table>
                    {/* {categories.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} /> */}
                </div>
        );
    }
    
}


export default connect(null, null)(withTranslate(ArchiveManagementTable));