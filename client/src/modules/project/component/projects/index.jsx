import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components/index';


import { ListProject } from './listProject';
import { CategoryProject } from './categoryProject';

function ManagementTableProject(props) {
    return (
       <ListProject />
    )
}
function mapState(state) {
    const { project, user } = state;
    return { project, user }
}

const connectedExampleManagementTable = connect(mapState, null)(withTranslate(ManagementTableProject));
export { connectedExampleManagementTable as Project };