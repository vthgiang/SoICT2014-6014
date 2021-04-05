import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { forceCheckOrVisible, LazyLoadComponent } from '../../../../common-components';
import CareerReduxAction from "./career-action";
import CareerField from "./career-field";
import CareerPosition from "./career-position";

function CareerManagement(props) {
    const [state, setState] = useState({});

    const { translate } = props;

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#career-field-tab" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Lĩnh vực công việc</a></li>
                <li><a href="#career-position-tab" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Vị trí công việc</a></li>
                <li><a href="#career-action-tab" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Hoạt động công việc</a></li>
            </ul>
            <div className="tab-content">

                {/** Lĩnh vực */}
                <div className="tab-pane active" id="career-field-tab">
                    <LazyLoadComponent
                        key="CareerField"
                    >
                        <CareerField />
                    </LazyLoadComponent>
                </div>

                {/** vị trí */}
                <div className="tab-pane" id="career-position-tab">
                    <LazyLoadComponent
                        key="CareerPosition"
                    >
                        <CareerPosition />
                    </LazyLoadComponent>
                </div>

                {/** hoat động */}
                <div className="tab-pane" id="career-action-tab">
                    <LazyLoadComponent
                        key="CareerReduxAction"
                    >
                        <CareerReduxAction />
                    </LazyLoadComponent>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerManagement));