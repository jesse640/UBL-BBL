import { useState } from 'react'

function App () {
  const [inputJson, setInputJson] = useState('')
  const [response, setResponse] = useState('')

  const handleCreateInvoice = async () => {
    try {
      const jsonData = JSON.parse(inputJson)

      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const xmlData = await response.text()
      setResponse(xmlData)
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
  }

  return (
    <div className='main'>
      <h1>Create Invoice</h1>

      <div className='app-container'>
        <div className='input-section'>
          <h3>Input JSON:</h3>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder={`Example JSON Input: 
{
  "id": "12345",
  "issueDate": "2025-04-01",
  "startDate": "2025-03-01",
  "endDate": "2025-03-31",
  "supplier": "Custom Cotter Pins",
  "customer": "North American Veeblefetzer",
  "totalAmount": 100,
  "currency": "CAD",
  "items": [
    {
      "description": "Cotter pin, MIL-SPEC",
      "amount": 100
    }
  ]
}`}
            rows={15}
            className='fixed-textarea'
          />
        </div>

        <button onClick={handleCreateInvoice}>Generate Invoice XML</button>

        <div className='response-section'>
          <h3>XML Response:</h3>
          <textarea
            value={response}
            readOnly
            rows={15}
            className='fixed-textarea'
            placeholder='XML response will appear here...'
          />
        </div>
      </div>

      {/* footer */}
      <div className='footer'>
        <span className='team-name'>UBL-BBL</span>
        <div className='footer-links'>
          <span className='footer-link'>Privacy Policy</span>
          <span className='footer-link'>Terms and Conditions</span>
          <span className='footer-link'>About Us</span>
        </div>
      </div>
    </div>
  )
}

export default App
