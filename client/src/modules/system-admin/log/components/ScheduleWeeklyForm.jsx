import React, { Component } from 'react';
import {SelectBox} from '../../../../common-components';

class ScheduleWeeklyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
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
                            value={'0'}
                            onChange={this.hanldeDate}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Giờ</label>
                        <input className="form-control" type="number"/>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Phút</label>
                        <input className="form-control" type="number"min="0" max="59"/>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>Giây</label>
                        <input className="form-control" type="number"/>
                    </div>
                </div>
            </div>
            <button className="btn btn-success pull-right">Save</button>
        </React.Fragment>);
    }
}
 
export default ScheduleWeeklyForm;