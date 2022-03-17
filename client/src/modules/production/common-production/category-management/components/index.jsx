import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CategoryManagementTable from './categoryManagementTable';
import CategoryManagementTree from './categoryManagementTree';
import {CategoryActions} from '../redux/actions';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components/index';

function CategoryManagement(props) {
    const [state, setState] = useState({  
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5
    });

    const updateCategoryTree = async () => {
        let { page, limit, currentRole } = state;
        await props.getCategoryToTree({ page, limit, managementLocation: currentRole });
        forceCheckOrVisible(true, false);
    };

    const updateCategoryTable = async () => {
        await props.getCategories();
        forceCheckOrVisible(true, false);
    };

    const { translate } = props;
    return (
        <div className= "nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#category-table" data-toggle="tab" onClick={() => updateCategoryTable()}>{translate('manage_warehouse.bin_location_management.category_table')}</a></li>
                    <li><a href="#category-tree" data-toggle="tab" onClick={() => updateCategoryTree()}>{translate('manage_warehouse.bin_location_management.category_tree')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="category-table">
                        <LazyLoadComponent>
                            <CategoryManagementTable />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="category-tree">
                        <LazyLoadComponent>
                            <CategoryManagementTree />
                        </LazyLoadComponent>
                    </div>
                </div>
               
        </div>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getCategoryToTree: CategoryActions.getCategoryToTree,
    getCategories: CategoryActions.getCategories
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryManagement));
