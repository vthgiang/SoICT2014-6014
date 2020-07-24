import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { AssetTypeActions } from '../../redux/actions';
// import TreeSelect from 'rc-tree-select';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeParent: []
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
        this.setState({ typeParent: value[0] });
    };

    save = () => {
        const { documentCode, documentName, documentDescription, typeParent } = this.state;
        console.log(this.state, 'this.state')
        this.props.createAssetTypes({
            typeNumber: documentCode,
            typeName: documentName,
            description: documentDescription,
            parent: typeParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.typeParent !== prevState.typeParent && nextProps.typeParent !== undefined) {
            return {
                ...prevState,
                typeParent: nextProps.typeParent
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, assetType } = this.props;
        const { tree, list } = assetType.administration.types;
        const { typeParent } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-document-domain"
                    formID="form-create-document-domain"
                    title={translate('document.administration.domains.add')}
                    func={this.save}
                >
                    <form id="form-create-document-domain">
                        <div className="form-group">
                            <label>Mã loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                        </div>
                        <div className="form-group">
                            <label>Tên loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                        </div>
                        <div className="form-group">
                            <label>Loại tài sản cha</label>
                            <TreeSelect data={list} value={typeParent.length > 1 ? [] : typeParent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
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