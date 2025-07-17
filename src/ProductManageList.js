import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const ProductManageList = () => {
  const [productManageData, setProductManageData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sno, setSno] = useState('')
  const [productname, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)

  const fetchProductManageData = async () => {
    try {
      const response = await axios.get('http://98.82.228.18:8132/api/ProductManageData')
      setProductManageData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product manage data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductManageData()
  }, [])

  const handleAddProductManage = async () => {
    const formData = new FormData()
    formData.append('sno', sno)
    formData.append('productname', productname)
    formData.append('description', description)
    formData.append('price', price)

    if (image) {
      formData.append('image', image)
    }

    try {
      const response = await axios.post(
        'http://98.82.228.18:8132/api/ProductManageData/pname',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      setProductManageData([...productManageData, response.data])
      setSno('')
      setProductName('')
      setDescription('')
      setPrice('')
      setImage(null)
      setVisible(false)
    } catch (error) {
      console.error('Error adding product manage:', error)
    }
  }

  const handleDeleteProductManage = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/ProductManageData/${id}`)
      setProductManageData(productManageData.filter((product) => product._id !== id))
    } catch (error) {
      console.error('Error deleting product manage:', error)
    }
  }

  const handleEditProductManage = (product) => {
    setSno(product.sno)
    setProductName(product.productname)
    setDescription(product.description)
    setPrice(product.price)
    setImage(null)
    setEditMode(true)
    setCurrentProductId(product._id)
    setVisible(true)
  }

  const handleUpdateProductManage = async () => {
    const formData = new FormData()
    formData.append('sno', sno)
    formData.append('productname', productname)
    formData.append('description', description)
    formData.append('price', price)
  
    if (image) {
      formData.append('image', image)
    }
  
    try {
      const response = await axios.put(
        `http://98.82.228.18:8132/api/ProductManageData/${currentProductId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      const updatedProduct = response.data
  
      setProductManageData(productManageData.map((product) => 
        product._id === currentProductId ? { ...product, ...updatedProduct } : product
      ))
  
      setSno('')
      setProductName('')
      setDescription('')
      setPrice('')
      setImage(null)
      setEditMode(false)
      setCurrentProductId(null)
      setVisible(false)
      window.alert('Product successfully updated')
    } catch (error) {
      console.error('Error updating product manage:', error)
    }
  }
  

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Product Manage List</h1>
          <CButton color="primary" size="sm" onClick={() => setVisible(true)}>
            Add Product Manage
          </CButton>
        </CCardHeader>
        <CCardBody>
          {productManageData.length === 0 ? (
            <div>No product manage data found.</div>
          ) : (
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S no.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productManageData.map((product) => (
                  <CTableRow key={product._id}>
                    <CTableDataCell>{product.sno}</CTableDataCell>
                    <CTableDataCell>{product.productname}</CTableDataCell>
                    <CTableDataCell>{product.description}</CTableDataCell>
                    <CTableDataCell>{product.price}</CTableDataCell>
                    <CTableDataCell>
                      {product.image && (
                        <img
                          src={`http://98.82.228.18:8132/uploads/${product.image}`}
                          alt={product.productname}
                          style={{ width: '100px' }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => handleEditProductManage(product)}
                      /> 
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: '#bb1616', cursor: 'pointer' }}
                        onClick={() => handleDeleteProductManage(product._id)}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{editMode ? 'Edit Product Manage' : 'Add Product Manage'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={sno}
                  onChange={(e) => setSno(e.target.value)}
                  placeholder="S No."
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={productname}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput type="file" onChange={(e) => setImage(e.target.files[0])} />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={editMode ? handleUpdateProductManage : handleAddProductManage}>
            {editMode ? 'Update' : 'Add'}
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ProductManageList
//