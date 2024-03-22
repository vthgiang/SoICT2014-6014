import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
// import { Tree, SlimScroll, ExportExcel } from '../../../../common-components';
import Swal from 'sweetalert2'
import { MajorActions } from '../redux/actions'
// import EditForm from './editForm';
// import CreateForm from './createForm';
import './major.css'

import MajorTable from './majorTable'

class Major extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <MajorTable />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getListMajor: MajorActions.getListMajor,
  deleteMajor: MajorActions.deleteMajor
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Major))
