import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabExperiencViewContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                experience: nextProps.employee.experience,
                cultural: nextProps.employee.cultural,
                foreignLanguage: nextProps.employee.foreignLanguage,
                educational: nextProps.employee.educational,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { cultural, foreignLanguage, educational, experience } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.academic_level')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('manage_employee.educational_level')}&emsp; </strong>
                            {cultural}
                        </div>
                        <div className="form-group" >
                            <strong>{translate('manage_employee.language_level')}&emsp; </strong>
                            {foreignLanguage}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.qualification')}&emsp; </strong>
                            {translate(`manage_employee.${educational}`)}
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.work_experience')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.from_month_year')}</th>
                                    <th>{translate('manage_employee.to_month_year')}</th>
                                    <th>{translate('manage_employee.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof experience !== 'undefined' && experience.length !== 0) &&
                                    experience.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.unit}</td>
                                            <td>{x.position}</td>
                                        </tr>

                                    ))
                                }

                            </tbody>
                        </table>
                        {
                            (typeof experience === 'undefined' || experience.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};
const tabExperience = connect(null, null)(withTranslate(TabExperiencViewContent));
export { tabExperience as TabExperiencViewContent };