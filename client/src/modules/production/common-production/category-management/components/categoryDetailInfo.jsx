import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { CategoryActions } from '../redux/actions';
function CategoryDetailForm(props) {
    const [state, setState] = useState({

    })

    useEffect(() => {
        if(props.categoryId !== state.categoryId){
            setState({
                ...state,
                categoryId: props.categoryId,
                code: props.code,
                name: props.name,
                type: props.type,
                parent: props.parent,
                goods: props.goods,
                description: props.description,
                errorOnCode: undefined,
                errorOnName: undefined
            })
        }
    }, [props.categoryId])


    const { translate, categories, goods, parentName} = props;
    const { code, name, type, description, } = state;
    const { listGoodsByCategory } = goods;
    return (
        <React.Fragment>

            <DialogModal
                modalID="modal-detail-category" isLoading={categories.isLoading}
                formID="form-detail-category"
                title={translate('manage_warehouse.category_management.detail')}
                msg_success={translate('manage_warehouse.category_management.detail_success')}
                msg_failure={translate('manage_warehouse.category_management.detail_faile')}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id="form-detail-category">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <strong>{translate('manage_warehouse.category_management.code')}:&emsp; </strong>
                            {code}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_warehouse.category_management.name')}:&emsp; </strong>
                            {name}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <strong>{translate('manage_warehouse.category_management.type')}:&emsp;</strong>
                            {parentName}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_warehouse.category_management.description')}:&emsp; </strong>
                            {description}
                        </div>
                    </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <strong>{translate('manage_warehouse.category_management.good')}:&emsp; </strong>
                            <div style={{ marginLeft: "20%" }}>{listGoodsByCategory.map((x, index) => <p key={index}>{x.name}</p>)}</div>
                        </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { categories, goods } = state;
    return { categories, goods };
}

const mapDispatchToProps = {
    editCategory: CategoryActions.editCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryDetailForm));
