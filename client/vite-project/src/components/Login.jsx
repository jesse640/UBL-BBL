import React, { useState } from 'react'
import './Login.css'

function LoginModel ({ isOpen, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [response, setResponse] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    try {
      const jsonData = {
        email: formData.email,
        password: formData.password
      }

      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
      }

      setResponse(JSON.stringify(responseData, null, 2))
      alert('Login successful!')
      onLoginSuccess()
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      handleLogin()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className='model-overlay' onClick={(e) => {
        if (e.target.className === 'model-overlay') {
          onClose()
        }
      }}
    >
      <div className='model'>
        <div className='model-header'>
          <h2>Login to your account</h2>
          <button className='close-button' onClick={onClose}>&times;</button>
        </div>
        <div className='model-body'>
          <form onSubmit={handleSubmit}>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className='error-message'>{errors.email}</div>}
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <div className='error-message'>{errors.password}</div>}
            </div>

            <div className='form-actions'>
              <button type='button' className='cancel-button' onClick={onClose}>Cancel</button>
              <button type='submit' className='submit-button'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModel
