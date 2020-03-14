import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { TabDiscipline } from './TabDiscipline';
import { TabPraise } from './TabPraise';
import { ToastContainer } from 'react-toastify';
class Discipline extends Component {
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="row">
                    {/* left column */}
                    <div className="col-sm-12">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title={translate('discipline.list_praise_title')} data-toggle="tab" href="#khenthuong">{translate('discipline.list_praise')}</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title={translate('discipline.list_discipline_title')} data-toggle="tab" href="#kyluat">{translate('discipline.list_discipline')}</a></li>
                            </ul>
                            <div className="tab-content">
                                <TabPraise />
                                <TabDiscipline />
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </React.Fragment>
        )
    };
}
const mapState = state => state;
const DisciplinePage = connect(mapState, null)(withTranslate(Discipline));

export { DisciplinePage as Discipline };