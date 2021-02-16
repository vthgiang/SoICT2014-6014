import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
class Toolbar extends Component {
  handleZoomChange = (e) => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(e.target.value)
    }
  }
  render() {
    const { translate } = this.props;
    const zoomRadios = [translate('system_admin.system_setting.backup.hour'),
    translate('system_admin.system_setting.backup.date'),
    translate('system_admin.system_setting.backup.week'),
    translate('system_admin.system_setting.backup.month')].map((value) => {
      const isActive = this.props.zoom === value;
      return (
        <label key={value} className={`radio-label ${isActive ? 'radio-label-active' : ''}`}>
          <input type='radio'
            checked={isActive}
            onChange={this.handleZoomChange}
            value={value} />
          { value}
        </label>
      );
    });

    return (
      <div className="tool-bar">
        { zoomRadios}
      </div>
    );
  }
}
export default withTranslate(Toolbar);