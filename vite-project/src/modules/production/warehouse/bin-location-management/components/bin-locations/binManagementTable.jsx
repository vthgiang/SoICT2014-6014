import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { Tree, SlimScroll, ExportExcel } from '../../../../../../common-components'
import './binLocation.css'
import BinEditForm from './binEditForm'
import BinCreateForm from './binCreateForm'
import { BinLocationActions } from '../../redux/actions'
import { DepartmentActions } from '../../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../../super-admin/user/redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { StockActions } from '../../../../warehouse/stock-management/redux/actions'
import ImportBinLocationModal from './importBinLocationModal'

function BinManagementTable(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    binParent: [],
    dataStock: [],
    deleteNode: []
  })

  useEffect(() => {
    props.getBinLocations()
    props.getAllDepartments()
    props.getUser()
    props.getAllGoods()
    props.getAllStocks({ managementLocation: state.currentRole })
  }, [])

  const onChanged = async (e, data) => {
    if (data.node !== undefined) {
      if (data.node.original.stock !== undefined) {
        let stock = data.node.original.stock
        await props.getBinLocations({ stock })
      }
      if (data.node.parent !== '#') {
        await setState({
          ...state,
          currentBin: data.node
        })
        window.$(`#edit-bin-location`).slideDown()
      }
    }
  }

  const checkNode = async (e, data) => {
    const { dataStock } = state
    if (data.node !== undefined) {
      let stock = data.node.original.stock
      let check = false
      for (let i = 0; i < dataStock.length; i++) {
        if (dataStock[i] === stock) {
          check = true
          break
        }
      }
      if (data.node.parent !== '#') {
        await setState({
          ...state,
          binParent: [...data.selected],
          dataStock: !check ? [...state.dataStock, stock] : state.dataStock,
          deleteNode: [...data.selected, ...data.node.children_d]
        })
      }
      let stockId = dataStock[0]
      await props.getBinLocations({ stockId })
    }
  }

  const unCheckNode = async (e, data) => {
    const { dataStock } = state
    if (data.node !== undefined) {
      let stock = data.node.original.stock
      let newDataStock
      if (dataStock) {
        newDataStock = dataStock.filter((item) => stock !== item)
      }
      if (data.node.parent !== '#') {
        await setState({
          ...state,
          binParent: [...data.selected],
          dataStock: newDataStock,
          deleteNode: [...data.selected]
        })
      }
      let stockId = dataStock[0]
      await props.getBinLocations({ stockId })
    }
  }
  const handleAddBinLocation = (event) => {
    event.preventDefault()
    window.$('#modal-create-bin-location').modal('show')
  }
  /**Mở modal import file excel */
  const handImportFile = (event) => {
    event.preventDefault()
    window.$('#import_bin_location').modal('show')
  }

  const deleteBins = async () => {
    deleteBinLocation()
    await props.getBinLocations()
  }

  const deleteBinLocation = async () => {
    const { translate } = props
    const { deleteNode, binParent } = state
    Swal.fire({
      html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value && binParent.length > 1) {
        props.deleteBinLocations(binParent, 'many')
        setState({
          ...state,
          deleteNode: [],
          binParent: []
        })
      } else if (result.value && binParent.length === 1) {
        props.deleteBinLocations(binParent, 'single')
        setState({
          ...state,
          deleteNode: [],
          binParent: []
        })
      }
    })
    await props.getBinLocations()
    window.$(`#edit-bin-location`).slideUp()
  }

  const { translate, binLocations, stocks } = props
  const { binParent, deleteNode, currentBin, dataStock } = state
  const { list, tree } = binLocations.binLocation
  const { listStocks } = stocks
  let stock = dataStock[0]
  let dataStocks = listStocks
    ? listStocks.map((node) => {
        return {
          ...node,
          text: node.name,
          icon: 'glyphicon glyphicon-home',
          state: { open: true },
          id: node._id,
          parent: '#'
        }
      })
    : null

  const dataBins = list
    ? list.map((node) => {
        return {
          ...node,
          text: node.name,
          icon: node.child.length > 0 ? 'glyphicon glyphicon-book' : 'glyphicon glyphicon-flag',
          state: { open: true },
          id: node._id,
          parent: node.parent ? node.parent.toString() : node.stock ? node.stock.toString() : '#'
        }
      })
    : null

  const dataTree = dataStocks.concat(dataBins)

  return (
    <React.Fragment>
      <div className='form-inline'>
        <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
          <button
            type='button'
            className='btn btn-success dropdown-toggler pull-right'
            data-toggle='dropdown'
            aria-expanded='true'
            title={translate('manage_warehouse.bin_location_management.add')}
            disabled={binParent.length > 1 ? true : false}
          >
            {translate('manage_warehouse.bin_location_management.add')}
          </button>
          <ul className='dropdown-menu pull-right'>
            <li>
              <a
                href='#modal-create-bin-location'
                title='Add BinLocation'
                onClick={(event) => {
                  handleAddBinLocation(event)
                }}
              >
                {translate('manage_warehouse.bin_location_management.add')}
              </a>
            </li>
            <li>
              <a
                href='#import_bin_location'
                title='ImportForm'
                onClick={(event) => {
                  handImportFile(event)
                }}
              >
                ImportFile
              </a>
            </li>
            <ImportBinLocationModal />
          </ul>
        </div>
      </div>

      {deleteNode.length > 0 && (
        <button className='btn btn-danger' style={{ marginLeft: '5px' }} onClick={deleteBins}>
          {translate('general.delete')}
        </button>
      )}
      <BinCreateForm />
      <div className='row'>
        <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
          <div className='bin-location-tree' id='bin-location-tree'>
            <Tree id='tree-qlcv-bin-location' onChanged={onChanged} checkNode={checkNode} unCheckNode={unCheckNode} data={dataTree} />
          </div>
          <SlimScroll
            outerComponentId='bin-location-tree'
            innerComponentId='tree-qlcv-bin-location'
            innerComponentWidth={'100%'}
            activate={true}
          />
        </div>
        <div className='col-xs-12 col-sm-8 col-md-8 col-lg-8'>
          {currentBin && (
            <BinEditForm
              binId={currentBin.id}
              binCode={currentBin.original.code}
              binName={currentBin.text}
              binStatus={currentBin.original.status}
              binUnit={currentBin.original.unit}
              binUsers={currentBin.original.users}
              binPath={currentBin.original.path}
              binContained={currentBin.original.contained}
              binCapacity={currentBin.original.capacity}
              binDescription={currentBin.original.description}
              binDepartment={currentBin.original.department}
              binEnableGoods={currentBin.original.enableGoods}
              binParent={currentBin.parent}
              binStock={currentBin.original.stock}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getBinLocations: BinLocationActions.getBinLocations,
  deleteBinLocations: BinLocationActions.deleteBinLocations,
  getAllDepartments: DepartmentActions.get,
  getUser: UserActions.get,
  getAllGoods: GoodActions.getAllGoods,
  getAllStocks: StockActions.getAllStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinManagementTable))
