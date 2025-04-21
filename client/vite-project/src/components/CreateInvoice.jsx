import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';

function CreateInvoice({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    id: '',
    issueDate: '',
    startDate: '',
    endDate: '',
    supplier: '',
    customer: '',
    currency: 'CAD',
    totalAmount: '',
    items: [{ description: '', amount: '' }]
  });
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id) newErrors.id = 'Invoice ID is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.totalAmount) newErrors.totalAmount = 'Total amount is required';
    
    formData.items.forEach((item, index) => {
      if (!item.description) newErrors[`itemDescription${index}`] = 'Description is required';
      if (!item.amount) newErrors[`itemAmount${index}`] = 'Amount is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('/create', invoice, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setResponse(true);
      onCreate(response.data);
      alert('Invoice created!')
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create formData. Please try again.');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleCreate();
    };
  };

  return (
    <div className="model-overlay" onClick={(e) => {
      if (e.target.className === 'model-overlay') {
        onClose();
      }
    }}>

    <div className="model">
        <div className="model-header">
          <h2>Create an Account</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="model-body">
          <form onSubmit={handleSubmit}>
            <div className= "form-grid">
              <div className="form-group">
                <label htmlFor="id">Invoice Id</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className={errors.id ? 'error' : ''}
                />
                {errors.id && <div className="error-message">{errors.id}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="issueDate">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className={errors.issueDate ? 'error' : ''}
                />
                {errors.issueDate && <div className="error-message">{errors.issueDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                  <label htmlFor="supplier">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className={errors.supplier ? 'input-error' : ''}
                  />
                  {errors.supplier && <p className="error-message">{errors.supplier}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="customer">Customer</label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    className={errors.customer ? 'input-error' : ''}
                  />
                  {errors.customer && <p className="error-message">{errors.customer}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="totalAmount">Total Amount</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    step="0.01"
                    className={errors.totalAmount ? 'input-error' : ''}
                  />
                  {errors.totalAmount && <p className="error-message">{errors.totalAmount}</p>}
                </div>
              </div>

              <div className="invoice-items-section">
              <div className="items-header">
                <h3>Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="add-item-btn"
                >
                  Add Item
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="form-group">
                    <label>Description*</label>
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      className={errors[`itemDescription${index}`] ? 'input-error' : ''}
                    />
                    {errors[`itemDescription${index}`] && (
                      <p className="error-message">{errors[`itemDescription${index}`]}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Amount*</label>
                    <input
                      type="number"
                      name="amount"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, e)}
                      step="0.01"
                      className={errors[`itemAmount${index}`] ? 'input-error' : ''}
                    />
                    {errors[`itemAmount${index}`] && (
                      <p className="error-message">{errors[`itemAmount${index}`]}</p>
                    )}
                  </div>
                  
                  <div className="item-actions">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="remove-item-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-button">Create Invoice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;