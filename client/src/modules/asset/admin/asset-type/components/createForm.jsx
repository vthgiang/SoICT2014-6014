import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, TreeSelect } from '../../../../../common-components';

import { AssetTypeActions } from '../redux/actions';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainParent: "",
        }
    }

    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            documentCode: value
        })
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ domainParent: value[0] });
    };

    save = () => {
        const { documentCode, documentName, documentDescription, domainParent } = this.state;
        this.props.createAssetTypes({
            typeNumber: documentCode,
            typeName: documentName,
            description: documentDescription,
            parent: domainParent ? domainParent : ""
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainParent !== prevState.domainParent && nextProps.domainParent.length) {
            let dm = prevState.domainParent;
            return {
                ...prevState,
                domainParent: dm,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, assetType } = this.props;
        const { domainParent } = this.state;

        const { list } = assetType.administration.types;

        let dataList = list.map(node => {
            return {
                ...node,
                id: node._id,
                name: node.typeName,
            }
        })

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-asset-type"
                    formID="form-create-asset-type"
                    title="Thêm mới loại tài sản"
                    func={this.save}
                >
                    {/* Thêm loại tài sản mới */}
                    <form id="form-create-asset-type">
                        {/* Mã loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.asset_type_code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                        </div>

                        {/* Tên loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.asset_type_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                        </div>

                        {/* Loại tài sản cha */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.parent_asset_type')}</label>
                            <TreeSelect data={dataList} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                        </div>

                        {/* Mô tả */}
                        <div className="form-group">
                            <label>{translate('asset.general_information.description')}</label>
                            <textarea style={{ minHeight: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createAssetTypes: AssetTypeActions.createAssetTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));