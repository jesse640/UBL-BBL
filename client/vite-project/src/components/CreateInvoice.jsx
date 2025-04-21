import React, { useState } from 'react';
import './CreateInvoice.css';

function CreateInvoice({ onClose }) {
  const [invoiceData, setInvoiceData] = useState({
    id: '',
    issueDate: getCurrentDate(),
    startDate: '',
    endDate: '',
    supplier: '',
    customer: '',
    currency: 'CAD',
    totalAmount: '',
    items: [
      { description: '', amount: '' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value
    };
    
    setInvoiceData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
    
    // Recalculate total amount
    if (name === 'amount') {
      calculateTotalAmount(updatedItems);
    }
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    
    setInvoiceData(prevData => ({
      ...prevData,
      totalAmount: total.toFixed(2)
    }));
  };

  const addItem = () => {
    setInvoiceData(prevData => ({
      ...prevData,
      items: [...prevData.items, { description: '', amount: '' }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
    calculateTotalAmount(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/invoice/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Reset form or close as needed
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create invoice');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice-container">
      <div className="create-invoice-header">
        <h2>Create New Invoice</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Invoice created successfully!</div>}

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Invoice ID</label>
            <input
              type="text"
              name="id"
              value={invoiceData.id}
              onChange={handleChange}
              placeholder="INV-001"
              required
            />
          </div>

          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={invoiceData.issueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              value={invoiceData.startDate} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={invoiceData.endDate} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Supplier Name</label>
            <input 
              type="text" 
              name="supplier" 
              value={invoiceData.supplier} 
              onChange={handleChange} 
              placeholder="Your Company Name" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              name="customer" 
              value={invoiceData.customer} 
              onChange={handleChange} 
              placeholder="Client Company Name" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Currency</label>
            <select 
              name="currency" 
              value={invoiceData.currency} 
              onChange={handleChange}
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Total Amount</label>
            <input 
              type="number" 
              name="totalAmount" 
              value={invoiceData.totalAmount} 
              readOnly 
              className="read-only"
            />
          </div>
        </div>
        
        <div className="items-section">
          <h3>Invoice Items</h3>
          
          {invoiceData.items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-description">
                <label>Description</label>
                <input 
                  type="text" 
                  name="description" 
                  value={item.description} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="Item description" 
                  required 
                />
              </div>
              
              <div className="item-amount">
                <label>Amount</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={item.amount} 
                  onChange={(e) => handleItemChange(index, e)} 
                  placeholder="0.00" 
                  step="0.01" 
                  required 
                />
              </div>
              
              {invoiceData.items.length > 1 && (
                <button 
                  type="button" 
                  className="remove-item-button" 
                  onClick={() => removeItem(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            className="add-item-button" 
            onClick={addItem}
          >
            + Add Item
          </button>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice
