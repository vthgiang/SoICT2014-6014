import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CareerReduxAction } from '../redux/actions';
import "./careerPosition.css";
import CareerPositionTable from './careerPositionTable';

class CareerPosition extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <CareerPositionTable />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    deleteCareerPosition: CareerReduxAction.deleteCareerPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerPosition));