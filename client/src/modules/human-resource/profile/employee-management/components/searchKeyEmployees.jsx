import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import SearchEmployeeForCareerPositiion from './searchEmployeeForCareerPositiion';
import SearchEmployeeForPackage from './searchEmployeeForPackage';

function SearchKeyEmployee(props) {
    const { translate } = props;
    return (
        <React.Fragment>
            <div className="get-employee">
                <div className="nav-tabs-custom" >
                    <ul className="nav nav-tabs">
                        <li  className="active"><a title="Tìm kiếm nhân sự gói thầu theo vị trí công việc" data-toggle="tab" href="#find_by_position">Tìm kiếm theo vị trí công việc</a></li>
                        <li><a title="Tìm kiếm theo gói thầu" data-toggle="tab" href="#find_by_bidding_package">Tìm kiếm theo gói thầu</a></li>
                    </ul>
                    < div className="tab-content">
                        {/* Tab thông tin chung */}
                        <div className="tab-pane active" id="find_by_position">
                            <SearchEmployeeForCareerPositiion/>
                        </div>
                        <div className="tab-pane " id="find_by_bidding_package">
                            <SearchEmployeeForPackage/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(SearchKeyEmployee)); 
