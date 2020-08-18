import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TreeSelect } from '../../../../common-components';

import { AssetTypeActions } from '../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            domainCode: value
        })
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            domainName: value
        })
    }

    validateName = async (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = "hello world";
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    domainName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    isValidateForm = () => {
        return this.validateName(this.state.domainName, false);
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            domainDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ domainParent: value[0] });
    };

    save = () => {
        const { domainId, domainCode, domainName, domainDescription, domainParent } = this.state;
        this.props.editAssetType(domainId, {
            typeNumber: domainCode,
            typeName: domainName,
            description: domainDescription,
            parent: domainParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                domainCode: nextProps.domainCode,
                domainName: nextProps.domainName,
                domainDescription: nextProps.domainDescription,
                domainParent: nextProps.domainParent,
                errorName: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, assetType } = this.props;
        const { tree, list } = assetType.administration.types;
        const { domainId, domainCode, domainName, domainDescription, domainParent, errorName } = this.state;

        let dataList = list.map(node => {
            return {
                ...node,
                id: node._id,
                name: node.typeName,
            }
        })

        console.log("222222222222222222222222222222222222222222222222", dataList);

        return (
            <div id="edit-asset-type">
                {/* Mã loại tài sản */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.asset_type_code')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleCode} value={domainCode} />
                </div>

                {/* Tên loại tài sản */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.asset_type_name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={domainName} />
                </div>

                {/* Loại tài sản cha */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.parent_asset_type')}<span className="text-red">*</span></label>
                    <TreeSelect data={dataList} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>

                {/* Mô tả */}
                <div className="form-group">
                    <label>{translate('asset.general_information.description')}<span className="text-red">*</span></label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={domainDescription} />
                </div>

                {/* Button */}
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('asset.general_information.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-asset-type`).slideUp()
                    }}>{translate('asset.general_information.cancel')}</button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { assetType } = state;
    return { assetType };
}

const mapDispatchToProps = {
    editAssetType: AssetTypeActions.editAssetType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));