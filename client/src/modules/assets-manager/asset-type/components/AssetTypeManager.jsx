import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {AssetTypeCreateForm} from './AssetTypeCreateForm';
import {AssetTypeEditForm} from './AssetTypeEditForm';
import {DataTableSetting, DeleteNotification, PaginateBar} from '../../../../common-components';
import {AssetTypeActions} from '../redux/actions';

class AssetTypeManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeNumber: "",
            typeName: "",
            page: 0,
            limit: 100,
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }

    componentDidMount() {
        this.props.searchAssetTypes(this.state);

    }

    // Bắt sự kiện click chỉnh sửa thông tin loại tài sản
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-assettype').modal('show');
    }

    // Function lưu giá trị mã loại tài sản vào state khi thay đổi
    handleTypeNumberChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }

    //Function lưu giá trị tên loại tài sản vào state khi thay đổi
    handleTypeNameChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function bắt sự kiện tìm kiếm
    handleSunmitSearch = async () => {
        // if (this.state.month === "") {
        await this.setState({
            ...this.state,
        })
        // }
        this.props.searchAssetTypes(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchAssetTypes(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchAssetTypes(this.state);
    }

    render() {

        // const { list } = this.props.department;
        console.log(this.props.assetType.listAssetTypes);

        const {translate, assetType} = this.props;
        var listAssetTypes = "";
        if (this.props.assetType.isLoading === false) {
            listAssetTypes = this.props.assetType.listAssetTypes;
        }
        // if(this.props.assetType.listAssetTypes.length ){
        //     listAssetTypes = this.props.assetType.listAssetTypes.map(assetType =>{
        //         this.props.assetType.listAssetTypes.forEach(item=>{
        //             if(assetType.parent === item._id){
        //                 assetType.parent= item.typeName
        //             }
        //         })
        //         return assetType;
        //     })
        // }
        var pageTotal = ((this.props.assetType.totalList % this.state.limit) === 0) ?
            parseInt(this.props.assetType.totalList / this.state.limit) :
            parseInt((this.props.assetType.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <AssetTypeCreateForm/>
                    {/* <div className="form-group">
                        <h4 className="box-title">Danh sách loại tài sản: </h4>
                    </div> */}
                    <div className="form-inline" style={{marginBottom: 10}}>
                        <div className="form-group">
                            <label className="form-control-static">Mã loại tài sản</label>
                            <input type="text" className="form-control" name="typeNumber" onChange={this.handleTypeNumberChange} placeholder="Mã loại tài sản" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên loại tài sản</label>
                            <input type="text" className="form-control" name="typeName" onChange={this.handleTypeNameChange} placeholder="Mã loại tài sản" autoComplete="off"/>
                        </div>

                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()}>{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="assettype-table" className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style={{width: "15%"}}>Mã loại tài sản</th>
                            <th style={{width: "25%"}}>Tên loại tài sản</th>
                            <th style={{width: "15%"}}>Thời gian khấu hao</th>
                            <th style={{width: "25%"}}>Loại tài sản cha</th>
                            <th style={{width: "20%"}}>Mô tả</th>
                            <th style={{width: '120px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="assettype-table"
                                    columnArr={[
                                        "Mã loại tài sản",
                                        "Tên loại tài sản",
                                        "Thời gian khấu hao",
                                        "Loại tài sản cha",
                                        "Mô tả",
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption={true}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {(typeof listAssetTypes !== 'undefined' && listAssetTypes.length !== 0) &&
                        listAssetTypes.map((x, index) => (
                            <tr key={index}>
                                <td>{x.typeNumber}</td>
                                <td>{x.typeName}</td>
                                <td>{x.timeDepreciation}</td>
                                <td>{x.parent ? x.parent.typeNumber + " - " + x.parent.typeName : ''}</td>
                                <td>{x.description}</td>
                                <td style={{textAlign: "center"}}>
                                    <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{width: '5px'}} title="Chỉnh sửa thông tin loại tài sản"><i
                                        className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content="Xóa thông tin loại tài sản"
                                        data={{
                                            id: x._id,
                                            info: x.typeNumber + " - " + x.typeName
                                        }}
                                        func={this.props.deleteAssetType}
                                    />
                                </td>
                            </tr>))
                        }
                        </tbody>
                    </table>
                    {assetType.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listAssetTypes === 'undefined' || listAssetTypes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage}/>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <AssetTypeEditForm
                        _id={this.state.currentRow._id}
                        typeNumber={this.state.currentRow.typeNumber}
                        typeName={this.state.currentRow.typeName}
                        timeDepreciation={this.state.currentRow.timeDepreciation}
                        parent={this.state.currentRow.parent}
                        description={this.state.currentRow.description}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const {assetType} = state;
    return {assetType};
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    deleteAssetType: AssetTypeActions.deleteAssetType,
};

const connectedListAssetType = connect(mapState, actionCreators)(withTranslate(AssetTypeManager));
export {connectedListAssetType as AssetTypeManager};
