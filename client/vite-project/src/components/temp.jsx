    <div className='invoice-modal-overlay'>
      <div className='invoice-modal-container'>
        <div className='invoice-modal-content'>
          <div className='invoice-modal-header'>
            <h2>Create New Invoice</h2>
            <button
              onClick={onClose}
              className='invoice-modal-close-btn'
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='invoice-form-grid'>
              <div className='form-group'>
                <label>Invoice ID*</label>
                <input
                  type='text'
                  name='id'
                  value={invoice.id}
                  onChange={handleChange}
                  className={errors.id ? 'input-error' : ''}
                />
                {errors.id && <p className='error-message'>{errors.id}</p>}
              </div>

              <div className='form-group'>
                <label>Issue Date*</label>
                <input
                  type='date'
                  name='issueDate'
                  value={invoice.issueDate}
                  onChange={handleChange}
                  className={errors.issueDate ? 'input-error' : ''}
                />
                {errors.issueDate && <p className='error-message'>{errors.issueDate}</p>}
              </div>

              <div className='form-group'>
                <label>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  value={invoice.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className='form-group'>
                <label>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  value={invoice.endDate}
                  onChange={handleChange}
                />
              </div>

              <div className='form-group'>
                <label>Supplier*</label>
                <input
                  type='text'
                  name='supplier'
                  value={invoice.supplier}
                  onChange={handleChange}
                  className={errors.supplier ? 'input-error' : ''}
                />
                {errors.supplier && <p className='error-message'>{errors.supplier}</p>}
              </div>

              <div className='form-group'>
                <label>Customer*</label>
                <input
                  type='text'
                  name='customer'
                  value={invoice.customer}
                  onChange={handleChange}
                  className={errors.customer ? 'input-error' : ''}
                />
                {errors.customer && <p className='error-message'>{errors.customer}</p>}
              </div>

              <div className='form-group'>
                <label>Currency</label>
                <select
                  name='currency'
                  value={invoice.currency}
                  onChange={handleChange}
                >
                  <option value='CAD'>CAD</option>
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='GBP'>GBP</option>
                </select>
              </div>

              <div className='form-group'>
                <label>Total Amount*</label>
                <input
                  type='number'
                  name='totalAmount'
                  value={invoice.totalAmount}
                  onChange={handleChange}
                  step='0.01'
                  className={errors.totalAmount ? 'input-error' : ''}
                />
                {errors.totalAmount && <p className='error-message'>{errors.totalAmount}</p>}
              </div>
            </div>

            <div className='invoice-items-section'>
              <div className='items-header'>
                <h3>Invoice Items</h3>
                <button
                  type='button'
                  onClick={addItem}
                  className='add-item-btn'
                >
                  Add Item
                </button>
              </div>

              {invoice.items.map((item, index) => (
                <div key={index} className='item-row'>
                  <div className='form-group'>
                    <label>Description*</label>
                    <input
                      type='text'
                      name='description'
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      className={errors[`itemDescription${index}`] ? 'input-error' : ''}
                    />
                    {errors[`itemDescription${index}`] && (
                      <p className='error-message'>{errors[`itemDescription${index}`]}</p>
                    )}
                  </div>

                  <div className='form-group'>
                    <label>Amount*</label>
                    <input
                      type='number'
                      name='amount'
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, e)}
                      step='0.01'
                      className={errors[`itemAmount${index}`] ? 'input-error' : ''}
                    />
                    {errors[`itemAmount${index}`] && (
                      <p className='error-message'>{errors[`itemAmount${index}`]}</p>
                    )}
                  </div>

                  <div className='item-actions'>
                    {invoice.items.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeItem(index)}
                        className='remove-item-btn'
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='form-actions'>
              <button
                type='button'
                onClick={onClose}
                className='cancel-btn'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='submit-btn'
              >
                {isSubmitting ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
