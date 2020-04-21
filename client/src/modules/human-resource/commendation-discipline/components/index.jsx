import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DisciplineManager } from './disciplineManagement';
import { PraiseManager } from './commendationManagement';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
class ManagerPraiseDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getDepartment();
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a title={translate('discipline.list_praise_title')} data-toggle="tab" href="#khenthuong">{translate('discipline.list_praise')}</a></li>
                    <li><a title={translate('discipline.list_discipline_title')} data-toggle="tab" href="#kyluat">{translate('discipline.list_discipline')}</a></li>
                </ul>
                <div className="tab-content" style={{ padding: 0 }}>
                    <PraiseManager />
                    <DisciplineManager />
                </div>
            </div>
        )
    };
}
function mapState(state) {
    const { department } = state;
    return { department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
};
const praiseDiscipline = connect(mapState, actionCreators)(withTranslate(ManagerPraiseDiscipline));

export { praiseDiscipline as ManagerPraiseDiscipline };