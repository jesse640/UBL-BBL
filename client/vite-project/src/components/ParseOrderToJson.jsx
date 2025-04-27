import React, { useState } from 'react'
import XMLParser from 'react-xml-parser'
import './ParseOrderToJson.css'

const ParseOrderToJson = ({ onClose }) => {
  const [xmlInput, setXmlInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleParseLocally = () => {
    setLoading(true)
    setError('')
    try {
      const xml = new XMLParser().parseFromString(xmlInput.trim())
      const orderData = extractOrderData(xml)
      setJsonOutput(JSON.stringify(orderData, null, 2))
    } catch (err) {
      setError('Invalid XML format')
      setJsonOutput('')
    } finally {
      setLoading(false)
    }
  }

  const extractOrderData = (xml) => {
    const getValue = (tagName) => xml.getElementsByTagName(tagName)[0]?.value || ''

    const orderLines = xml.getElementsByTagName('cac:OrderLine').map(line => {
      return {
        description: line.getElementsByTagName('cbc:Description')[0]?.value || '',
        amount: line.getElementsByTagName('cbc:LineExtensionAmount')[0]?.value || ''
      }
    })

    return {
      id: getValue('cbc:ID'),
      issueDate: getValue('cbc:IssueDate'),
      startDate: getValue('cbc:StartDate'),
      endDate: getValue('cbc:EndDate'),
      supplier: getValue('cbc:Name'),
      customer: getValue('cbc:Name'),
      currency: xml.getElementsByTagName('cbc:PayableAmount')[0]?.attributes?.currencyID || '',
      totalAmount: getValue('cbc:PayableAmount'),
      items: orderLines
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
            onClick={handleParseLocally}
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
