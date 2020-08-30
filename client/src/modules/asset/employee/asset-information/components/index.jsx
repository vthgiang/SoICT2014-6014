import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetGeneralInfo } from '../components/employeeAssetManagement';
import { EmployeePurchaseRequestManagement } from '../../use-request/components/PurchaseRequestManager';
import { EmployeeIncidentManagement } from '../../incident/components/incidentManagement';

class EmployeeAssetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    

    openCity =(evt, cityName)=> {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
      }
  
    render() {
        let { translate } =this.props;
        return (
            <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>

                            <ul className="nav nav-tabs">
                            
                            <li className ="active"><a data-toggle="tab" href={`#general`}>{translate('menu.manage_info_asset')}</a></li>
                            <li><a data-toggle="tab" href={`#use-request`}>{translate('menu.manage_incident_asset')}</a></li>
                            <li><a data-toggle="tab" href={`#incident`}>{translate('menu.manage_recommend_distribute_asset')}</a></li>

                        </ul>
                        <div className ="tab-content">
                        <AssetGeneralInfo id ="general"/>
                        <EmployeePurchaseRequestManagement id ="use-request"/>
                        <EmployeeIncidentManagement id="incident"/>
                        </div>
                
            </div>                
        );
    };
}


export default connect(null, null)(withTranslate(EmployeeAssetManagement)); 