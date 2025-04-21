import React, { useState } from 'react';
import './SignUp.css';

function SignupModel({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must include an uppercase letter';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Password must include a number';
    else if (!/[!@#$%^&*]/.test(formData.password)) newErrors.password = 'Password must include a special character';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    try {
      const jsonData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      
      setResponse(JSON.stringify(responseData, null, 2));
      alert('Signup successful!');
      onClose();
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSignUp();
    }
  };

  if (!isOpen) return null;

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

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}

              <div className="password-requirements">
                Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-button">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupModel;