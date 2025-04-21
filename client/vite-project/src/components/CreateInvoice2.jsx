import React, { useState } from 'react';
import './CreateInvoice.css';

function CreateInvoice({ onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    issueDate: '',
    startDate: '',
    endDate: '',
    supplier: '',
    customer: '',
    totalAmount: '',
    currency: 'CAD',
    items: [{ description: '', quantity: 1, amount: 0, totalAmount: 0 }]
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === 'quantity' || field === 'amount') {
      const qty = field === 'quantity' ? value : updatedItems[index].quantity;
      const amt = field === 'amount' ? value : updatedItems[index].amount;
      updatedItems[index].totalAmount = qty * amt;
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, amount: 0, totalAmount: 0 }]
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * parseFloat(item.amount || 0);
      return sum + itemTotal;
    }, 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validate required fields
    if (!formData.id || !formData.issueDate || !formData.supplier || !formData.customer) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Validate items
    for (const item of formData.items) {
      if (!item.description || !item.quantity || !item.amount) {
        setError('Please fill all item fields');
        setLoading(false);
        return;
      }
    }

    const calculatedTotal = calculateTotal();
    const newInvoice = {
      invoiceId: formData.id,
      date: formData.issueDate,
      totalAmount: parseFloat(calculatedTotal),
      status: 'pending',
      currency: formData.currency,
      supplier: formData.supplier,
      customer: formData.customer,
      details: {
        id: formData.id,
        issueDate: formData.issueDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        supplier: formData.supplier,
        customer: formData.customer,
        totalAmount: parseFloat(calculatedTotal),
        currency: formData.currency,
        status: 'pending',
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          amount: parseFloat(item.amount),
          totalAmount: item.quantity * parseFloat(item.amount)
        }))
      }
    };

    // Get existing invoices from localStorage or initialize empty array
    const existingInvoices = JSON.parse(localStorage.getItem('dummyInvoices')) || [];
    
    // Check if invoice with this ID already exists
    if (existingInvoices.some(inv => inv.invoiceId === newInvoice.invoiceId)) {
      setError('An invoice with this ID already exists');
      setLoading(false);
      return;
    }

    // Add new invoice and save to localStorage
    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem('dummyInvoices', JSON.stringify(updatedInvoices));
    
    setSuccess('Invoice created successfully!');
    setFormData({
      id: '',
      issueDate: '',
      startDate: '',
      endDate: '',
      supplier: '',
      customer: '',
      totalAmount: '',
      currency: 'CAD',
      items: [{ description: '', quantity: 1, amount: 0, totalAmount: 0 }]
    });
    setLoading(false);
  };

  return (
    <div className="create-invoice-container">
      <div className="invoice-header">
        <h2>Create New Invoice</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">Invoice ID*</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="issueDate">Issue Date*</label>
            <input
              type="date"
              id="issueDate"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Period Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">Period End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="supplier">Supplier Name*</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customer">Customer Name*</label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
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
        </div>
        
        <div className="invoice-items-section">
          <h3>Invoice Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="invoice-item">
              <div className="item-grid">
                <div className="form-group">
                  <label>Description*</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity*</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Unit Price*</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Line Total</label>
                  <div className="line-total">
                    {formData.currency} {(item.quantity * parseFloat(item.amount || 0)).toFixed(2)}
                  </div>
                </div>
                
                <div className="form-group item-actions">
                  {formData.items.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-item-button"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button type="button" className="add-item-button" onClick={addItem}>
            + Add Item
          </button>
        </div>
        
        <div className="invoice-total">
          <span>Total Amount:</span>
          <span className="total-amount">{formData.currency} {calculateTotal()}</span>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;