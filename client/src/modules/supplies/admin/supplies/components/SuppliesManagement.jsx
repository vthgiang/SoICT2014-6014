import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from "sweetalert2";
import { DeleteNotification, PaginateBar, SmartTable } from "../../../../../common-components";
import { getTableConfiguration } from "../../../../../helpers/tableConfiguration";
import { SuppliesActions } from "../redux/actions";
import { SuppliesCreateForm } from "./SuppliesCreateForm";

const getSuppliesName = (listSupplies, idSupplies) => {
    let suppliesName;
    if (listSupplies?.length && idSupplies) {
        for (let i = 0; i < listSupplies.length; i++) {
            if (listSupplies[i]?._id === idSupplies) {
                suppliesName = `${listSupplies[i].code} - ${listSupplies[i].suppliesName}`;
                break;
            }
        }
    }
    return suppliesName;
}

function SuppliesManagement(props) {
    const tableId_constructor = "table-supplies-management";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        getAll: "false",
        code: "",
        suppliesName: "",
        page: 0,
        limit: limit_constructor
    });

    const [selectedData, setSelectedData] = useState();

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const { suppliesReducer, translate, } = props;
    const { page, limit, tableId, code, suppliesName, currentRow, } = state;

    useEffect(() => {
        props.searchSupplies(state);
    }, []);

    //tìm kiếm theo mã vật tư
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    };

    //tìm kiếm theo tên vật tư
    const handleSuppliesNameChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    };

    // Bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState({
            ...state,
            page: 0,
        });
        props.searchSupplies({ page: 0, ...state });
    }

    const handleDeleteAnSupplies = (id) => {
        props.deleteSupplies({
            ids: [id]
        });
    }

    const handleDeleteOptions = () => {
        const shortTitle = `<h4 style="color: red"><div>${translate('supplies.supplies_management.delete_info')} "${selectedData?.length && selectedData.length === 1 ? getSuppliesName(props.suppliesReducer?.listSupplies, selectedData[0]) : ""}" ?</div></h4>`;
        const longTitle = `<h4 style="color: red"><div>Xóa thông tin ${selectedData?.length > 1 ? selectedData.length : ""} vật tư ?</div></h4>`;

        Swal.fire({
            html: selectedData?.length === 1 ? shortTitle : longTitle,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && selectedData.length > 0) {
                //console.log("hang select delete:",selectedData);
                props.deleteSupplies({
                    ids: selectedData
                });
            }
        })

    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.searchSupplies({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.searchSupplies({ ...state, page: parseInt(page) });
    }

    var pageTotal = ((suppliesReducer.totalList % limit) === 0) ?
        parseInt(suppliesReducer.totalList / limit) :
        parseInt((suppliesReducer.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);

    return (
        <div className="box">
            <div className="box-body qlcv">
                {/* Thêm vật tư mới */}
                <div className="dropdown pull-right">
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('menu.add_asset_lot_title')}>
                        {translate('menu.add_supplies')}
                    </button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-add-supplies').modal('show')}>{translate('menu.add_supplies')}</a></li>
                    </ul>
                </div>
                <SuppliesCreateForm />

                {/* Tìm kiếm */}
                <div className="form-inline">
                    {/* Mã vật tư */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.supplies_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('supplies.supplies_management.code')} autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Tên vật tư */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.supplies_management.suppliesName')}</label>
                        <input type="text" className="form-control" name="suppliesName" onChange={handleSuppliesNameChange} placeholder={translate('supplies.supplies_management.suppliesName')} autoComplete="off" />
                    </div>

                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('supplies.general_information.search')} onClick={handleSubmitSearch}>{translate('supplies.general_information.search')}</button>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}
                </div>

                {/* Bảng thông tin vật tư */}
                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_example.index'),
                        code: translate('supplies.supplies_management.code'),
                        suppliesName: translate('supplies.supplies_management.suppliesName'),
                        totalPurchase: translate('supplies.supplies_management.totalPurchase'),
                        totalAllocation: translate('supplies.supplies_management.totalAllocation'),
                        price: translate('supplies.supplies_management.price'),
                    }}
                    tableHeaderData={{
                        index: <th>{translate('manage_example.index')}</th>,
                        code: <th>{translate('supplies.supplies_management.code')}</th>,
                        suppliesName: <th>{translate('supplies.supplies_management.suppliesName')}</th>,
                        totalPurchase: <th>{translate('supplies.supplies_management.totalPurchase')}</th>,
                        totalAllocation: <th>{translate('supplies.supplies_management.totalAllocation')}</th>,
                        price: <th>{translate('supplies.supplies_management.price')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={suppliesReducer.listSupplies?.length > 0 && suppliesReducer.listSupplies.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            code: <td>{item.code}</td>,
                            suppliesName: <td>{item.suppliesName}</td>,
                            totalPurchase: <td>{item.totalPurchase}</td>,
                            totalAllocation: <td>{item.totalAllocation}</td>,
                            price: <th>{item.price}</th>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} ><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} ><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('asset.general_information.delete_info')}
                                    data={{
                                        id: item._id,
                                        info: item.code + " - " + item.suppliesName
                                    }}
                                    func={handleDeleteAnSupplies}
                                />
                            </td>
                        }
                    })}
                    dataDependency={suppliesReducer.listSupplies}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {suppliesReducer.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!suppliesReducer.listSupplies || suppliesReducer.listSupplies.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar
                    display={suppliesReducer.listSupplies ? suppliesReducer.listSupplies.length : null}
                    total={suppliesReducer.totalList ? suppliesReducer.totalList : null}
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    func={setPage}
                />

            </div>
        </div>
    );
};

function mapState(state) {
    const { suppliesReducer, user, auth } = state;
    return { suppliesReducer, user, auth };
};

const actionCreators = {
    searchSupplies: SuppliesActions.searchSupplies,
    deleteSupplies: SuppliesActions.deleteSupplies,
};

const connectedSuppliesManagement = connect(mapState, actionCreators)(withTranslate(SuppliesManagement));
export { connectedSuppliesManagement as SuppliesManagement };