import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AssetService } from '../../../asset-information/redux/services';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../../asset-type/redux/actions";
import { getPropertyOfValue } from '../../../../../../helpers/stringMethod';
import { AssetTypeService } from '../../../asset-type/redux/services';
import { TreeSelect } from '../../../../../../common-components';

class AssetIsExpired extends Component {
    constructor(props) {
        super(props);
        this.INFO_SEARCH = {
            type: []
        }
        this.state = {
            listAssets: null,
            limit: 5,
            type: this.INFO_SEARCH.type
        }

    }

    componentDidMount() {
        AssetService.getAll({
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 0
        }).then(res => {
            if (res.data.success) {
                this.setState({ listAssets: res.data.content.data });
            }
        }).catch(err => {
            console.log(err);
        });

        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.list })
            }
        }).catch(err => {
            console.log(err);
        });

        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getUser();
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    formatStatus = (status) => {
        const { translate } = this.props;
        switch (status) {
            case 'ready_to_use': return translate('asset.general_information.ready_use');
            case 'in_use': return translate('asset.general_information.using');
            case 'broken': return translate('asset.general_information.damaged');
            case 'lost': return translate('asset.general_information.lost');
            case 'disposed': return translate('asset.general_information.disposal');
            default: return ''
        }
    }

    handleChangeTypeAsset = (value) => {
        if (value.length === 0) {
            value = []
        }
        this.INFO_SEARCH.type = value;
        this.forceUpdate();
    }

    getAssetTypes = () => {
        let { assetType } = this.state;
        let typeArr = [];
        assetType && assetType.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    handleSearchData = async () => {

        await this.setState(state => {
            return {
                ...state,
                type: this.INFO_SEARCH.type
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { user, assetType, setAssetIsExpiredExportData } = this.props;
        const { listAssets, } = this.state;
        const typeAsset = this.state.type;
        var userlist = user && user.list;
        var ExpiryDateAssets = [], willExpiryDateAssets = [];
        let nowDate = new Date();
        let typeArr = this.getAssetTypes();
        let { type } = this.INFO_SEARCH;
        let filterAsset = [];
        if (typeAsset && typeAsset.length) {
            listAssets.map(x => {
                if (x.assetType.length) {
                    for (let i in x.assetType) {
                        for (let j in typeAsset) {
                            typeAsset[j] === x.assetType[i]._id && filterAsset.push(x);
                        }
                    }
                }
            })
        }
        else {
            filterAsset = listAssets;
        }

        if (listAssets && !ExpiryDateAssets.length && !willExpiryDateAssets.length) {
            for (let i in listAssets) {
                if (listAssets[i].purchaseDate && listAssets[i].usefulLife) {
                    let date = listAssets[i].purchaseDate.split("-")
                    if ((Number(date[1]) + listAssets[i].usefulLife) % 12 == 0) {
                        date[0] = String(Math.floor((Number(date[1]) + listAssets[i].usefulLife) / 12 - 1) + Number(date[0]));
                    } else {
                        date[0] = String(Math.floor((Number(date[1]) + listAssets[i].usefulLife) / 12) + Number(date[0]));
                    }
                    let month = String((Number(date[1]) + listAssets[i].usefulLife) % 12);


                    date[1] = month != '0' ? month : '12';
                    date[2] = date[2].slice(0, 2)
                    let Expirydate = [date[0], date[1], date[2]].join("-")
                    let ExpiryDate = new Date(Expirydate)

                    let expiry;
                    let day = ExpiryDate - nowDate;

                    if (day < 0) {
                        day = nowDate - ExpiryDateAssets;
                        let data = {
                            asset: listAssets[i],
                            day: translate('asset.dashboard.expired')
                        }
                        ExpiryDateAssets.push(data);
                    } else {
                        expiry = Math.round(day / 1000 / 60 / 60 / 24);
                        if (expiry < 16) {
                            let data = {
                                asset: listAssets[i],
                                day: expiry
                            }
                            willExpiryDateAssets.push(data);
                        }
                    }
                }
            }
        }

        if (assetType && assetType.listAssetTypes)
            var assettypelist = assetType.listAssetTypes;

        // Lấy dữ liệu để export
        if (ExpiryDateAssets && ExpiryDateAssets.length !== 0 || willExpiryDateAssets && willExpiryDateAssets.length !== 0) {
            if (ExpiryDateAssets && ExpiryDateAssets.length !== 0) {
                setAssetIsExpiredExportData(ExpiryDateAssets, assettypelist, userlist, false);
            } else if (willExpiryDateAssets && willExpiryDateAssets.length !== 0) {
                setAssetIsExpiredExportData(willExpiryDateAssets, assettypelist, userlist, true);
            }
        }
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline pull-right">
                        {/* Chọn loại tài sản */}
                        <div className="form-group  ">
                            <label >{translate('asset.general_information.asset_type')}</label>
                            <TreeSelect
                                data={typeArr}
                                value={type}
                                handleChange={this.handleChangeTypeAsset}
                                mode="hierarchical"
                            />
                        </div>
                        {/* Tim kiem */}
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>
                    {/* Bảng các tài sản */}
                    {(ExpiryDateAssets && ExpiryDateAssets.length !== 0) || (willExpiryDateAssets && willExpiryDateAssets.length !== 0) ?
                        <table id="asset-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.purchase_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.manager')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.dashboard.remaining_time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(willExpiryDateAssets && willExpiryDateAssets.length !== 0) &&
                                    willExpiryDateAssets.map((x, index) => (
                                        <tr key={index}>
                                            <td>{!x.asset ? '' : x.asset.code}</td>
                                            <td>{!x.asset ? '' : x.asset.assetName}</td>
                                            <td>{!x.asset ? '' : x.asset.assetType && x.asset.assetType.length ? x.asset.assetType.map((item, index) => { let suffix = index < x.asset.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : ''}</td>
                                            <td>{!x.asset ? '' : this.formatDate(x.asset.purchaseDate)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.managedBy, 'email', false, userlist)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.assignedToUser, 'email', false, userlist)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.assignedToOrganizationalUnit, 'name', false)}</td>
                                            <td>{this.formatStatus(!x.asset ? '' : x.asset.status)}</td>
                                            <td>{x.day} {translate('asset.dashboard.day')}</td>
                                        </tr>))
                                }
                                {(ExpiryDateAssets && ExpiryDateAssets.length !== 0) &&
                                    ExpiryDateAssets.map((x, index) => (
                                        <tr key={index}>
                                            <td>{!x.asset ? '' : x.asset.code}</td>
                                            <td>{!x.asset ? '' : x.asset.assetName}</td>
                                            <td>{!x.asset ? '' : x.asset.assetType && x.asset.assetType.length ? x.asset.assetType.map((item, index) => { let suffix = index < x.asset.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : ''}</td>
                                            <td>{!x.asset ? '' : this.formatDate(x.asset.purchaseDate)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.managedBy, 'email', false, userlist)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.assignedToUser, 'email', false, userlist)}</td>
                                            <td>{!x.asset ? '' : getPropertyOfValue(x.asset.assignedToOrganizationalUnit, 'name', false)}</td>
                                            <td>{!x.asset ? '' : this.formatStatus(x.asset.status)}</td>
                                            <td>{x.day}</td>
                                        </tr>))
                                }
                            </tbody>
                        </table> : translate('general.no_data')
                    }

                </div>
            </React.Fragment >
        );
    }
}

function mapState(state) {
    const { assetsManager, assetType, user } = state;
    return { assetsManager, assetType, user };
}

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
};

const AssetIsExpiredConnect = connect(mapState, actionCreators)(withTranslate(AssetIsExpired));
export { AssetIsExpiredConnect as AssetIsExpired };