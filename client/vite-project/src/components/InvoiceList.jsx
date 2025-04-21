import React, { useState, useEffect } from 'react';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Load invoices and contacts from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem('dummyInvoices')) || [];
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setInvoices(storedInvoices);
    setContacts(storedContacts);
  }, []);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (invoiceId) => {
    try {
      const updatedInvoices = invoices.filter(inv => inv.invoiceId !== invoiceId);
      localStorage.setItem('dummyInvoices', JSON.stringify(updatedInvoices));
      setInvoices(updatedInvoices);
      setSelectedInvoice(null);
    } catch (err) {
      setError('Failed to delete invoice');
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      setError('Name and email are required');
      return;
    }

    const updatedContacts = [...contacts, newContact];
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
    setNewContact({ name: '', phone: '', email: '' });
    setShowContactForm(false);
    setError('');
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  return (
    <div className="dashboard-container">
      {/* Left Panel - Invoices */}
      <div className="invoices-panel">
        <h2 className='title'>Your Invoices</h2>
        <div className="invoices-list">
          {invoices.map(invoice => (
            <div 
              key={invoice.invoiceId}
              className="invoice-item"
              onClick={() => handleInvoiceClick(invoice)}
            >
              <div className="invoice-header">
                <h3>#{invoice.invoiceId}</h3>
                <span className={`status-badge status-${invoice.status}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="invoice-details">
                <span>{new Date(invoice.date).toLocaleDateString()}</span>
                <span>{invoice.currency} {invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="panel-divider"></div>

      {/* Right Panel - Contacts */}
      <div className="contacts-panel">
        <div className="contacts-header">
          <h2 className='title2'>Contacts</h2>
          <button 
            className="add-contact-button"
            onClick={() => setShowContactForm(true)}
          >
            + Add Contact
          </button>
        </div>
        
        <div className="contacts-list">
          {contacts.map((contact, index) => (
            <div key={index} className="contact-item">
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
              </div>
              <button 
                className="delete-contact"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContact(index);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2>Invoice #{selectedInvoice.invoiceId}</h2>
            
            <div className="invoice-summary">
              <div>
                <h4>Supplier</h4>
                <p>{selectedInvoice.supplier}</p>
              </div>
              <div>
                <h4>Customer</h4>
                <p>{selectedInvoice.customer}</p>
              </div>
              <div>
                <h4>Date</h4>
                <p>{new Date(selectedInvoice.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h4>Total</h4>
                <p>{selectedInvoice.currency} {selectedInvoice.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="invoice-items">
              <h3>Items</h3>
              <div className="items-header">
                <span>Description</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {selectedInvoice.details.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.description}</span>
                  <span>{item.quantity}</span>
                  <span>{selectedInvoice.currency} {item.amount.toFixed(2)}</span>
                  <span>{selectedInvoice.currency} {item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <button 
              className="delete-invoice"
              onClick={() => handleDeleteInvoice(selectedInvoice.invoiceId)}
            >
              Delete Invoice
            </button>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
          <div className="modal-content contact-form-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowContactForm(false)}>×</button>
            <h2 className="title3">Add New Contact</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Full Name*</label>
              <input
                type="text"
                name="name"
                value={newContact.name}
                onChange={handleContactChange}
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={newContact.phone}
                onChange={handleContactChange}
                placeholder="(123) 456-7890"
              />
            </div>
            
            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={newContact.email}
                onChange={handleContactChange}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-button"
                onClick={handleAddContact}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;