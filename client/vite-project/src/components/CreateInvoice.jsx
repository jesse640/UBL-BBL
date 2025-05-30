import React, { useState, useEffect } from 'react'
import './CreateInvoice.css'

function CreateInvoice ({ onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    issueDate: '',
    startDate: '',
    endDate: '',
    supplier: '',
    customer: '',
    totalAmount: '',
    currency: 'AUD',
    items: [{ description: '', quantity: 1, amount: 0, totalAmount: 0 }]
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value

    if (field === 'quantity' || field === 'amount') {
      const qty = field === 'quantity' ? value : updatedItems[index].quantity
      const amt = field === 'amount' ? value : updatedItems[index].amount
      updatedItems[index].totalAmount = qty * amt
    }

    setFormData({
      ...formData,
      items: updatedItems
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, amount: 0, totalAmount: 0 }]
    })
  }

  const removeItem = (index) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData({
      ...formData,
      items: updatedItems
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * parseFloat(item.amount || 0)
      return sum + itemTotal
    }, 0).toFixed(2)
  }

  const resetForm = () => {
    setFormData({
      id: '',
      issueDate: '',
      startDate: '',
      endDate: '',
      supplier: '',
      customer: '',
      totalAmount: '',
      currency: 'AUD',
      items: [{ description: '', quantity: 1, amount: 0, totalAmount: 0 }]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!token) {
      setError('Authentication token is missing. Please log in again.')
      setLoading(false)
      return
    }

    const calculatedTotal = calculateTotal()

    console.log('Submitting invoice with token:', token)

    try {
      const response = await fetch('http://34.201.243.150:3000/invoicev2/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: formData.id,
          issueDate: formData.issueDate,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          supplier: formData.supplier,
          customer: formData.customer,
          totalAmount: calculatedTotal,
          currency: formData.currency,
          items: formData.items.map(item => ({
            description: item.description,
            quantity: Number(item.quantity),
            amount: Number(item.amount)
          }))
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || 'Failed to create invoice')
        } else {
          const textError = await response.text()
          throw new Error(textError || `Failed to create invoice (Status: ${response.status})`)
        }
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        setSuccess(data.message || 'Invoice created successfully!')
      } else {
        setSuccess('Invoice created successfully!')
      }

      resetForm()
    } catch (error) {
      console.error('Error creating invoice:', error)
      setError(error.message || 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='create-invoice-container'>
      <div className='invoice-header'>
        <h2>Create New Invoice</h2>
        <button className='close-button' onClick={onClose}>×</button>
      </div>

      {error && <div className='error-message'>{error}</div>}
      {success && <div className='success-message'>{success}</div>}

      <form onSubmit={handleSubmit} className='invoice-form'>
        <div className='form-grid'>
          <div className='form-group'>
            <label htmlFor='id'>Invoice ID*</label>
            <input
              type='text'
              id='id'
              name='id'
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='issueDate'>Issue Date*</label>
            <input
              type='date'
              id='issueDate'
              name='issueDate'
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='startDate'>Period Start Date</label>
            <input
              type='date'
              id='startDate'
              name='startDate'
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='endDate'>Period End Date</label>
            <input
              type='date'
              id='endDate'
              name='endDate'
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='form-grid'>
          <div className='form-group'>
            <label htmlFor='supplier'>Supplier Name*</label>
            <input
              type='text'
              id='supplier'
              name='supplier'
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='customer'>Customer Name*</label>
            <input
              type='text'
              id='customer'
              name='customer'
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='currency'>Currency</label>
            <select
              id='currency'
              name='currency'
              value={formData.currency}
              onChange={handleChange}
            >
              <option value='AUD'>AUD</option>
              <option value='NZD'>NZD</option>
              <option value='EUR'>EUR</option>
              <option value='USD'>USD</option>
            </select>
          </div>
        </div>

        <div className='invoice-items-section'>
          <h3>Invoice Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className='invoice-item'>
              <div className='item-grid'>
                <div className='form-group'>
                  <label>Description*</label>
                  <input
                    type='text'
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Quantity*</label>
                  <input
                    type='number'
                    min='1'
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Unit Price*</label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Line Total</label>
                  <div className='line-total'>
                    {formData.currency} {(item.quantity * parseFloat(item.amount || 0)).toFixed(2)}
                  </div>
                </div>

                <div className='form-group item-actions'>
                  {formData.items.length > 1 && (
                    <button
                      type='button'
                      className='remove-item-button'
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type='button' className='add-item-button' onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className='invoice-total'>
          <span>Total Amount:</span>
          <span className='total-amount'>{formData.currency} {calculateTotal()}</span>
        </div>

        <div className='form-actions'>
          <button type='button' className='cancel-button' onClick={onClose}>
            Cancel
          </button>
          <button type='submit' className='submit-button' disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateInvoice
