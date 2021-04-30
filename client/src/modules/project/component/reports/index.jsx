import React from 'react'
import { connect } from 'react-redux'
import { ListProjectReport } from './listProjectReport'

const index = (props) => {
    return (
        <ListProjectReport />
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(index)
