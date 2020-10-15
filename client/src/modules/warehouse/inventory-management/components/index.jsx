import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import InventoryDetailForm from './inventoryDetailForm';
import LotDetailForm from './lotDetailForm';

import { LazyLoadComponent, forceCheckOrVisible, SelectMulti, DataTableSetting, DeleteNotification, DatePicker } from '../../../../common-components/index';

class InventoryManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleShowDetailInfo = async () => {
        window.$('#modal-detail-inventory').modal('show');
    }

    handleShowDetailLot = async () => {
        window.$('#modal-detail-lot').modal('show');
    }

    render() {

        const { translate } = this.props;

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#inventory-products" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.product')}</a></li>
                    <li><a href="#inventory-materials" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.material')}</a></li>
                    <li><a href="#inventory-equipments" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.equipment')}</a></li>
                    <li><a href="#inventory-assets" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.asset')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="box-body qlcv">
                    {/* <GoodCreateForm type={ type } />
                    {
                        this.state.currentRow &&
                        <GoodEditForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    }

                    {
                        this.state.currentRow &&
                        <GoodDetailForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    } */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Kho Tạ Quang Bửu"},
                                    { value: '2', text: "Kho Trần Đại Nghĩa"},
                                    { value: '3', text: "Kho Đại Cồ Việt"},
                                    { value: '4', text: "Kho Lê Thanh Nghị"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.good_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.inventory_management.good_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.inventory_management.name')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.inventory_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.inventory_management.search')}</button>
                        </div>
                    </div>
                    <InventoryDetailForm />
                    <LotDetailForm />

                        <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>{translate('manage_warehouse.inventory_management.index')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.name')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.unit')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.quantity')}</th>  
                                    <th>{translate('manage_warehouse.inventory_management.lot')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.date')}</th>
                                    <th style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table`}
                                            columnArr={[
                                                translate('manage_warehouse.inventory_management.index'),
                                                translate('manage_warehouse.inventory_management.name'),
                                                translate('manage_warehouse.inventory_management.unit'),
                                                translate('manage_warehouse.inventory_management.quantity'),
                                                translate('manage_warehouse.inventory_management.lot'),
                                                translate('manage_warehouse.inventory_management.date')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                        <tr style={{backgroundColor: '#dddd'}}>
                                            <td>1</td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Thùng</td>
                                            <td>50</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Thùng</td>
                                            <td>20</td>
                                            <td>L0012</td>
                                            <td>20-10-2020</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailLot()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Thùng</td>
                                            <td>30</td>
                                            <td>L0015</td>
                                            <td>30-10-2020</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailLot()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr style={{backgroundColor: '#dddd'}}>
                                            <td>2</td>
                                            <td>ACID CITRIC MONO</td>
                                            <td>Hộp</td>
                                            <td>90</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Hộp</td>
                                            <td>90</td>
                                            <td>L0108</td>
                                            <td>20-10-2020</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailLot()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr style={{backgroundColor: '#dddd'}}>
                                            <td>3</td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Thùng</td>
                                            <td>50</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>ĐƯỜNG ACESULFAME K</td>
                                            <td>Thùng</td>
                                            <td>50</td>
                                            <td>L0220</td>
                                            <td>20-10-2020</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailLot()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, null)(withTranslate(InventoryManagement));
