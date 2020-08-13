import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox} from '../../../../common-components';
import { SystemSettingActions } from '../redux/actions';

class ScheduleWeeklyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        console.log("state weekly", this.state)

        return (<React.Fragment>
            <div className="row">
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Ngày</label>
                        <SelectBox
                            id="schedule-weekly-day"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '1', text: 'Thứ 2'},
                                {value: '2', text: 'Thứ 3'},
                                {value: '3', text: 'Thứ 4'},
                                {value: '4', text: 'Thứ 5'},
                                {value: '5', text: 'Thứ 6'},
                                {value: '6', text: 'Thứ 7'},
                                {value: '0', text: 'Chủ nhật'},
                            ]}
                            onChange={this.handleDay}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Giờ</label>
                        <SelectBox
                            id="schedule-weekly-hour"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '0'},
                                {value: '1', text: '1'},
                                {value: '2', text: '2'},
                                {value: '3', text: '3'},
                                {value: '4', text: '4'},
                                {value: '5', text: '5'},
                                {value: '6', text: '6'},
                                {value: '7', text: '7'},
                                {value: '8', text: '8'},
                                {value: '9', text: '9'},
                                {value: '10', text: '10'},
                                {value: '11', text: '11'},
                                {value: '12', text: '12'},
                                {value: '13', text: '13'},
                                {value: '14', text: '14'},
                                {value: '15', text: '15'},
                                {value: '16', text: '16'},
                                {value: '17', text: '17'},
                                {value: '18', text: '18'},
                                {value: '19', text: '19'},
                                {value: '20', text: '20'},
                                {value: '21', text: '21'},
                                {value: '22', text: '22'},
                                {value: '23', text: '23'},
                            ]}
                            onChange={this.hanldeHour}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Phút</label>
                        <SelectBox
                            id="schedule-weekly-minute"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '0'},
                                {value: '1', text: '1'},
                                {value: '2', text: '2'},
                                {value: '3', text: '3'},
                                {value: '4', text: '4'},
                                {value: '5', text: '5'},
                                {value: '6', text: '6'},
                                {value: '7', text: '7'},
                                {value: '8', text: '8'},
                                {value: '9', text: '9'},
                                {value: '10', text: '10'},
                                {value: '11', text: '11'},
                                {value: '12', text: '12'},
                                {value: '13', text: '13'},
                                {value: '14', text: '14'},
                                {value: '15', text: '15'},
                                {value: '16', text: '16'},
                                {value: '17', text: '17'},
                                {value: '18', text: '18'},
                                {value: '19', text: '19'},
                                {value: '20', text: '20'},
                                {value: '21', text: '21'},
                                {value: '22', text: '22'},
                                {value: '23', text: '23'},
                                {value: '24', text: '24'},
                                {value: '25', text: '25'},
                                {value: '26', text: '26'},
                                {value: '27', text: '27'},
                                {value: '28', text: '28'},
                                {value: '29', text: '29'},
                                {value: '30', text: '30'},
                                {value: '31', text: '31'},
                                {value: '32', text: '32'},
                                {value: '33', text: '33'},
                                {value: '34', text: '34'},
                                {value: '35', text: '35'},
                                {value: '36', text: '36'},
                                {value: '37', text: '37'},
                                {value: '38', text: '38'},
                                {value: '39', text: '39'},
                                {value: '40', text: '40'},
                                {value: '41', text: '41'},
                                {value: '42', text: '42'},
                                {value: '43', text: '43'},
                                {value: '44', text: '44'},
                                {value: '45', text: '45'},
                                {value: '46', text: '46'},
                                {value: '47', text: '47'},
                                {value: '48', text: '48'},
                                {value: '49', text: '49'},
                                {value: '50', text: '50'},
                                {value: '51', text: '51'},
                                {value: '52', text: '52'},
                                {value: '53', text: '53'},
                                {value: '54', text: '54'},
                                {value: '55', text: '55'},
                                {value: '56', text: '56'},
                                {value: '57', text: '57'},
                                {value: '58', text: '58'},
                                {value: '59', text: '59'},
                            ]}
                            onChange={this.hanldeMinute}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Giây</label>
                        <SelectBox
                            id="schedule-weekly-second"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '0'},
                                {value: '1', text: '1'},
                                {value: '2', text: '2'},
                                {value: '3', text: '3'},
                                {value: '4', text: '4'},
                                {value: '5', text: '5'},
                                {value: '6', text: '6'},
                                {value: '7', text: '7'},
                                {value: '8', text: '8'},
                                {value: '9', text: '9'},
                                {value: '10', text: '10'},
                                {value: '11', text: '11'},
                                {value: '12', text: '12'},
                                {value: '13', text: '13'},
                                {value: '14', text: '14'},
                                {value: '15', text: '15'},
                                {value: '16', text: '16'},
                                {value: '17', text: '17'},
                                {value: '18', text: '18'},
                                {value: '19', text: '19'},
                                {value: '20', text: '20'},
                                {value: '21', text: '21'},
                                {value: '22', text: '22'},
                                {value: '23', text: '23'},
                                {value: '24', text: '24'},
                                {value: '25', text: '25'},
                                {value: '26', text: '26'},
                                {value: '27', text: '27'},
                                {value: '28', text: '28'},
                                {value: '29', text: '29'},
                                {value: '30', text: '30'},
                                {value: '31', text: '31'},
                                {value: '32', text: '32'},
                                {value: '33', text: '33'},
                                {value: '34', text: '34'},
                                {value: '35', text: '35'},
                                {value: '36', text: '36'},
                                {value: '37', text: '37'},
                                {value: '38', text: '38'},
                                {value: '39', text: '39'},
                                {value: '40', text: '40'},
                                {value: '41', text: '41'},
                                {value: '42', text: '42'},
                                {value: '43', text: '43'},
                                {value: '44', text: '44'},
                                {value: '45', text: '45'},
                                {value: '46', text: '46'},
                                {value: '47', text: '47'},
                                {value: '48', text: '48'},
                                {value: '49', text: '49'},
                                {value: '50', text: '50'},
                                {value: '51', text: '51'},
                                {value: '52', text: '52'},
                                {value: '53', text: '53'},
                                {value: '54', text: '54'},
                                {value: '55', text: '55'},
                                {value: '56', text: '56'},
                                {value: '57', text: '57'},
                                {value: '58', text: '58'},
                                {value: '59', text: '59'},
                            ]}
                            onChange={this.hanldeSecond}
                            multiple={false}
                        />
                    </div>
                </div>
            
            </div>
            <button className="btn btn-success" disabled={!this.isFormValid ? true : false} onClick={this.save}>Lưu</button>
        </React.Fragment>);
    }

    handleDay = (value) => {
        this.setState({
            day: value[0]
        })
    }

    hanldeHour = (value) => {
        this.setState({
            hour: value[0]
        })
    }

    hanldeMinute = (value) => {
        this.setState({
            minute: value[0]
        })
    }

    hanldeSecond = (value) => {
        this.setState({
            second: value[0]
        })
    }

    isFormValid = () => {
        const {date, hour, minute, second} = this.state;

        if(date !== undefined && hour !== undefined && minute !== undefined && second !== undefined){
            return true;
        }else{
            return false;
        }
    }

    save = () => {
        const {schedule} = this.props;
        const {date, hour, minute, second} = this.state;

        if(this.isFormValid){
            return this.props.backupDatabase({auto: 'on', schedule},{
                date, hour, minute, second
            })
        }
    }
}
 
function mapStateToProps(state) {
}

const mapDispatchToProps = {
    backupDatabase: SystemSettingActions.backupDatabase
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ScheduleWeeklyForm));