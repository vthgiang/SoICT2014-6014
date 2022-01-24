import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CategoryManagementTable from './categoryManagementTable';
import CategoryManagementTree from './categoryManagementTree';

function CategoryManagement(props) {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <CategoryManagementTable />
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(CategoryManagement));
