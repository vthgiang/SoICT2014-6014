import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { AssetTypeActions } from '../../redux/actions';

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
        const {domainId, domainCode, domainName, domainDescription, domainParent} = this.state;
        this.props.editAssetType(domainId, {
            typeNumber: domainCode,
            typeName: domainName,
            description: domainDescription,
            parent: domainParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                domainCode: nextProps.domainCode,
                domainName: nextProps.domainName,
                domainDescription: nextProps.domainDescription,
                domainParent: nextProps.domainParent
            } 
        } else {
            return null;
        }
    }

    render() {
        const {translate, assetType}=this.props;
        const {tree,list} = assetType.administration.types;
        const {domainId, domainCode, domainName, domainDescription, domainParent} = this.state;
        console.log("edit domain: ",this.state)
        
        return ( 
            <div id="edit-document-domain">
                <div className="form-group">
                    <label>Mã loại tài sản<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleCode} value={domainCode}/>
                </div>
                <div className="form-group">
                    <label>Tên loại tài sản<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={domainName}/>
                </div>
                <div className="form-group">
                    <label>Loại tài sản cha<span className="text-red">*</span></label>
                    <TreeSelect data={list} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect"/>
                </div>
                <div className="form-group">
                    <label>Mô tả<span className="text-red">*</span></label>
                    <textarea style={{minHeight: '120px'}} type="text" className="form-control" onChange={this.handleDescription} value={domainDescription}/>
                </div> 
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{marginLeft: '5px'}} onClick={this.save}>Lưu</button>
                    <button className="btn btn-danger" onClick={()=>{
                        window.$(`#edit-document-domain`).slideUp()
                    }}>Đóng</button>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editAssetType: AssetTypeActions.editAssetType
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );