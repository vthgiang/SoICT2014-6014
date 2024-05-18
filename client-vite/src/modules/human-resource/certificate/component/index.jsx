import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CertificateActions } from '../redux/actions'
import './certificate.css'

import CertificateTable from './certificateTable'

class Certificate extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <CertificateTable />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getListCertificate: CertificateActions.getListCertificate,
  deleteCertificate: CertificateActions.deleteCertificate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Certificate))
