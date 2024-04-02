import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { JourneyTable } from './journeyTable';
import { JourneyActions } from '../redux/actions'

function Journeys(props) {

    const { journey, translate } = props;
    const [state, setState] = useState({
    })

    return (
        <div>
            <JourneyTable/>
        </div>
    );
}

function mapState(state) {
    const journey = state.journey;
    return { journey }
}
const actions = {
    getJourneys: JourneyActions.getJourneys
}

export default connect(mapState, actions)(withTranslate(Journeys));