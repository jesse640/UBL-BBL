import React, { useState } from 'react'
import './ValidateInvoice.css'

function ValidateInvoice ({ onClose }) {
  const [xmlInput, setXmlInput] = useState('')
  const [schemaResults, setSchemaResults] = useState({ status: null, message: '', errors: [] })
  const [peppolResults, setPeppolResults] = useState({ status: null, message: '', errors: [] })
  const [isValidating, setIsValidating] = useState(false)

  const handleValidate = async () => {
    if (!xmlInput.trim()) {
      alert('Please enter XML content first')
      return
    }

    setIsValidating(true)
    setSchemaResults({ status: null, message: 'Validating...', errors: [] })
    setPeppolResults({ status: null, message: 'Validating...', errors: [] })

    try {
      const schemaResponse = await fetch('http://34.201.243.150:3000/invoiceV2/validate/UBL-Invoice-2.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Accept: 'application/json'
        },
        body: xmlInput.trim()
      })
      const schemaText = await schemaResponse.text()
      let schemaData = {}
      try {
        schemaData = JSON.parse(schemaText)
      } catch (e) {
        console.error('Failed to parse schema response:', e)
      }

      if (schemaResponse.ok) {
        setSchemaResults({
          status: 'success',
          message: schemaData.message || 'Invoice is valid according to UBL-Invoice-2.1 schema',
          errors: []
        })
      } else {
        setSchemaResults({
          status: 'error',
          message: schemaData.message || 'Invoice is invalid according to UBL-Invoice-2.1 schema',
          errors: schemaData.errors || []
        })
      }

      // Validate A-NZ-PEPPOL
      const peppolResponse = await fetch('http://34.201.243.150:3000/invoiceV2/validate/A-NZ-PEPPOL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Accept: 'application/json'
        },
        body: xmlInput.trim()
      })
      const peppolText = await peppolResponse.text()
      let peppolData = {}
      try {
        peppolData = JSON.parse(peppolText)
      } catch (e) {
        console.error('Failed to parse PEPPOL response:', e)
      }

      if (peppolResponse.ok) {
        setPeppolResults({
          status: 'success',
          message: peppolData.message || 'Invoice is valid according to A-NZ PEPPOL',
          errors: []
        })
      } else {
        setPeppolResults({
          status: 'error',
          message: peppolData.message || 'Invoice is invalid according to A-NZ PEPPOL',
          errors: peppolData.errors || []
        })
      }
    } catch (error) {
      console.error('Validation error:', error)
      alert(`An error occurred: ${error.message}`)
    } finally {
      setIsValidating(false)
    }
  }

  const handleClear = () => {
    setXmlInput('')
    setSchemaResults({ status: null, message: '', errors: [] })
    setPeppolResults({ status: null, message: '', errors: [] })
  }

  return (
    <div className='validate-invoice-container'>
      <h2 className='validate-invoice-title'>Validate Invoice</h2>
      <div className='validate-content'>
        <div className='xml-input-section'>
          <div className='input-header'>
            <h3>XML Input</h3>
            <div className='input-actions'>
              <button
                className='clear-button'
                onClick={handleClear}
                disabled={isValidating}
              >
                Clear
              </button>
              <button
                className='validate-button'
                onClick={handleValidate}
                disabled={isValidating || !xmlInput.trim()}
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </div>
          <textarea
            className='xml-textarea'
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder='Paste your XML invoice here...'
            disabled={isValidating}
          />
        </div>

        <div className='results-section'>
          <div className={`result-box ${schemaResults.status === 'success' ? 'success' : schemaResults.status === 'error' ? 'error' : ''}`}>
            <h3>UBL Schema Validation</h3>
            {schemaResults.status && (
              <div className='result-content'>
                <p className='result-message'>{schemaResults.message}</p>
                {schemaResults.errors.length > 0 && (
                  <div className='error-list'>
                    <h4>Errors:</h4>
                    <ul>
                      {schemaResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`result-box ${peppolResults.status === 'success' ? 'success' : peppolResults.status === 'error' ? 'error' : ''}`}>
            <h3>A-NZ PEPPOL Validation</h3>
            {peppolResults.status && (
              <div className='result-content'>
                <p className='result-message'>{peppolResults.message}</p>
                {peppolResults.errors.length > 0 && (
                  <div className='error-list'>
                    <h4>Errors:</h4>
                    <ul>
                      {peppolResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidateInvoice
