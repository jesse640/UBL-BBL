import React, { useState } from 'react'
import './ParseOrderToJson.css'

const ParseOrderToJson = ({ onClose }) => {
  const [xmlInput, setXmlInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://34.201.243.150:3000/invoiceV2/parseOrder2json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Accept: 'application/json'
        },
        body: xmlInput.trim()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse XML')
      }

      const data = await response.json()
      setJsonOutput(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err.message)
      setJsonOutput('')
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = () => {
    setXmlInput('')
    setJsonOutput('')
    setError('')
  }

  return (
    <div className='parse-order-container'>
      <div className='parse-order-header'>
        <h2>Parse Order XML to JSON</h2>
        <button className='close-button' onClick={onClose}>×</button>
      </div>

      <div className='parse-order-content'>
        <div className='input-container'>
          <h3>XML Input</h3>
          <textarea
            className='xml-input'
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder='Paste your XML order data here...'
          />
        </div>

        <div className='controls'>
          <button
            className='parse-button'
            onClick={handleSubmit}
            disabled={!xmlInput.trim() || loading}
          >
            {loading ? 'Processing...' : 'Parse XML to JSON'}
          </button>
          <button
            className='clear-button'
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>

        <div className='output-container'>
          <h3>JSON Output</h3>
          {error && <div className='error-message'>{error}</div>}
          <pre className='json-output'>
            {jsonOutput}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ParseOrderToJson
