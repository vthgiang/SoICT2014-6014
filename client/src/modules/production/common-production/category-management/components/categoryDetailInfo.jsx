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
                goods: props.goods,
                description: props.description,
                errorOnCode: undefined,
                errorOnName: undefined
            })
        }
    }, [props.categoryId])

    const { translate, categories, goods } = props;
    const { code, name, type, description } = state;
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
                    <div className="form-group">
                        <strong>{translate('manage_warehouse.category_management.code')}:&emsp; </strong>
                        {code}
                    </div>
                    <div className="form-group">
                        <strong>{translate('manage_warehouse.category_management.name')}:&emsp; </strong>
                        {name}
                    </div>
                    <div className="form-group">
                        <strong>{translate('manage_warehouse.category_management.type')}:&emsp; </strong>
                        {translate(`manage_warehouse.category_management.${type}`)}
                    </div>
                    <div className="form-group">
                        <strong>{translate('manage_warehouse.category_management.good')}:&emsp; </strong>
                        <div style={{ marginLeft: "15%" }}>{listGoodsByCategory.map((x, index) => <p key={index}>{x.name}</p>)}</div>
                    </div>
                    <div className="form-group">
                        <strong>{translate('manage_warehouse.category_management.description')}:&emsp; </strong>
                        {description}
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
