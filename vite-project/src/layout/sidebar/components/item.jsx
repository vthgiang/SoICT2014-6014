import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import store from '../../../redux/store'
class Item extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  checkURL = (urlName, linkArr) => {
    var result = false
    if (linkArr !== undefined) {
      linkArr.forEach((link) => {
        if (link.url === urlName) {
          result = true
        }
      })
    }

    return result
  }

  render() {
    const { item, translate } = this.props
    const { links } = this.props.auth

    return (
      <React.Fragment>
        {this.checkURL(item.path, links) && (
          <li className={window.location.pathname === item.path ? 'active' : ''}>
            <Link
              to={item.path}
              onClick={() => {
                if (window.location.pathname !== item.path) {
                  store.dispatch({ type: 'SWITCH_PAGE' })
                }
              }}
            >
              <i className={item.icon} /> <span>{translate(item.name)}</span>
            </Link>
          </li>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth } = state
  return { auth }
}

export default connect(mapStateToProps, null)(withTranslate(Item))
