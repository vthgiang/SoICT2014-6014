import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectMulti, DataTableSetting } from '../../../../../common-components';
import Swal from "sweetalert2";
import ModalAddVariantOption from './modalAddVariantOption';

function VariantCreateForm(props) {
    const EMPTY_UNIT = {
        name: '',
        conversionRate: '',
        description: ''
    };

    const [state, setState] = useState({
        unit: Object.assign({}, EMPTY_UNIT),
        listUnit: props.initialData,
        editInfo: false,
        listUnitSelected: []
    })

    const addVariantOptions = () => {
        window.$("#modal-add-variant-option").modal("show");
    };

    const handleAddVariantOptions = async (data) => {
        // await setState({
        //     ...state,
        //     billSelected: data.code + " -- " + formatDate(data.createdAt)
        // })
        // handleBillChange(data);
    };


    const { translate, id } = props;
    let { listUnit, unit, errorOnUnitName, errorOnConversionRate, description, conversionRate, errorOnBaseUnit, listUnitSelected, packingRule } = state;
    return (

        <fieldset className="scheduler-border">
            <ModalAddVariantOption onDataChange={handleAddVariantOptions} />
            <legend className="scheduler-border">Biến thể hàng hóa
                <a>
                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </a>
            </legend>

            <div className={`form-group`}>
                <label className="control-label">Tùy chọn biến thể</label>
                <div>
                    <p>Chưa có tùy chọn nào được thêm</p>
                    <p type="button" className="btn btn-info" onClick={() => addVariantOptions()}>Thêm mới</p>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th title="STT">STT</th>
                        <th title="Tên tùy chọn">Tên tùy chọn</th>
                        <th title="Giá trị">Giá trị</th>
                    </tr>
                </thead>
                {/* <tbody id={`unit-create-good${id}`}>
                    {
                        (typeof listUnit === 'undefined' || listUnit.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                            listUnit.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.conversionRate}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditUnit(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteUnit(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody> */}
            </table>

            <div className={`form-group`} style={{ marginTop: "15px" }}>
                <label className="control-label">Biến thể</label>
                <p>Biến thể sẽ tự động khởi tạo sau khi thêm mới tùy chọn.</p>
            </div>

            <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{ marginTop: "15px" }}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ảnh</th>
                            <th>Biến thể</th>
                            <th>SKU</th>
                            <th>Giá mặc định</th>
                            <th>Giá sale</th>
                            <th>MSRP</th>
                            <th>Chiều rộng</th>
                            <th>Chiều cao</th>
                            <th>Độ sâu</th>
                            <th>UPC/EAN</th>
                            <th>MPN</th>
                            <th style={{ width: "120px", textAlign: "center" }}>
                                {translate("table.action")}
                                <DataTableSetting
                                    tableId={`good-table`}
                                    columnArr={[
                                        'Ảnh',
                                        'Biến thể',
                                        'SKU',
                                        'Giá mặc định',
                                        'Giá sale',
                                        'MSRP',
                                        'Chiều rộng',
                                        'Chiều cao',
                                        'Độ sâu',
                                        'UPC/EAN',
                                        'MPN',
                                    
                                    ]}
                                    // limit={state.limit}
                                    // setLimit={setLimit}
                                    hideColumnOption={true}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>


        </fieldset >
    )
}

export default connect(null, null)(withTranslate(VariantCreateForm));
