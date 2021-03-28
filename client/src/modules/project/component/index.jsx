import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../common-components/index';


import { ListProject } from './listProject';
import { CategoryProject } from './categoryProject';


function ManagementTableProject(props) {

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#administration-project-list-data" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Danh sách dự án</a></li>
                <li><a href="#category-project-list-data" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Hạng mục dự án</a></li>
            </ul>
            <div className="tab-content">

                {/** Danh sách dự án */}
                <div className="tab-pane active" id="administration-project-list-data">
                    <LazyLoadComponent
                        key="ListProject"
                    >
                        <ListProject />
                    </LazyLoadComponent>
                </div>

                {/** Hạng mục dự án */}
                <div className="tab-pane" id="category-project-list-data">
                    <LazyLoadComponent
                        key="CategoryProject"
                    >
                        <CategoryProject />
                    </LazyLoadComponent>
                </div>

            </div>
        </div>
    )


}
function mapState(state) {
    const { project, user } = state;

    return { project, user }
}

const connectedExampleManagementTable = connect(mapState, null)(withTranslate(ManagementTableProject));
export { connectedExampleManagementTable as Project };