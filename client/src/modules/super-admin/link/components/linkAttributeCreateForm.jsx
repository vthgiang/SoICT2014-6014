import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components';
import { LinkActions } from '../redux/actions';
import { AttributeActions } from '../../attribute/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

function LinkAttributeCreateForm(props) {
    const [state, setState] = useState({
        linkList: [],
        linkAttributes: [],
    })

    


    const handleLinkList = (value) => {
        setState({
            ...state,
            linkList: value
        });
    }

    /**
     * Bắt sự kiện chỉnh sửa tên thuộc tính
     */
     // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }
    
    useEffect(() => {
        props.getAttribute();
    }, [])

    const validateAttributes = () => {
        var linkAttributes = state.linkAttributes;
        let result = true;

        if (linkAttributes.length !== 0) {

            for (let n in linkAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, linkAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, linkAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        console.log(result);
        return result;
    }

    const isFormValidated = () => {
        let { linkList, linkAttributes } = state;

        if (linkList.length == 0 || linkAttributes.length == 0 || !validateAttributes()) return false;
        return true;
    }

    const save = () => {
        var keys_to_keep = ['attributeId', 'value', 'description']
        const data = {
            linkList: state.linkList,
            attributes: state.linkAttributes.map(element => Object.assign({}, ...keys_to_keep.map(key => ({[key]: element[key]}))))
        }

        if (isFormValidated()) {
            // return props.createLinkAttribute(data);
        }
    }

    const handleOpenModalCreateLinkAttribute = () => {
        window.$(`#modal-create-link-attribute`).modal('show')
    }
    console.log('state', state);

    // const handleOpenModalImportAttribute = () => {
    //     window.$(`#modal-import-role-attribute`).modal('show')
    // }

    const { translate, link } = props;
    const { linkAttributes} = state;

    let allLinksByCategory;
    let allLinkCategory=link.list.map(l => l.category);
    let linkCategory = allLinkCategory.filter((x, i, a) => a.indexOf(x) == i);
    
    if(link.list){
        allLinksByCategory=linkCategory.map(cat=>{
            var temp=[];
            
            for(let i=0;i<link.list.length;i++){
                if(link.list[i].category == cat){
                    temp.push({
                        text: link.list[i].url,
                        value : link.list[i].id
                    });
                }
            }
            var unit ={
                text : cat,
                value : temp
            };

            return unit;                
        });
    }

    console.log(allLinksByCategory)

    return (
        <React.Fragment>
            {/* Button thêm thuộc tính */}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                {
                    <div className="dropdown">
                        <button style={{ marginRight: 10 }} type="button" className="btn btn-primary dropdown-toggler" data-toggle="dropdown" aria-expanded="true">{translate('manage_link.add_attribute')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#" onClick={handleOpenModalCreateLinkAttribute}>{translate('manage_link.add_link_attribute')}</a></li>
                            {/* <li><a href="#" onClick={handleOpenModalImportRoleAttribute}>Thêm thuộc tính từ file</a></li> */}
                        </ul>
                    </div>
                }
            </div>

            {/* <ModalImportRole /> */}
            {/* <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} /> */}

            <DialogModal
                modalID="modal-create-link-attribute" isLoading={link.isLoading}
                formID="form-create-link-attribute"
                title={translate('manage_link.add_attribute_title')}
                size={50}
                func={save} disableSubmit={!isFormValidated()}
            >
                {/* Form thêm phân quyền mới */}
                <form id="form-create-link-attribute">

                    {/* Các trang thêm thuộc tính*/}
                    <div className="form-group">
                        <label>{translate('manage_link.links_add_attribute')}<span className="text-red">*</span></label>
                        <SelectBox
                            id="select-link-attribute-create"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={allLinksByCategory}
                            onChange={handleLinkList}
                            multiple={true}
                        />
                    </div>

                    {/* Các thuộc tính của phân quyền */}
                    <AttributeTable 
                        attributes={linkAttributes}
                        handleChange={handleChange}
                        attributeOwner={'linkAttributes'}
                        translation={'manage_link'}
                    />

                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { link } = state;
    return { link };
}


const mapDispatchToProps = {
    // createLinkAttribute: LinkActions.createLinkAttribute,
    getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LinkAttributeCreateForm));