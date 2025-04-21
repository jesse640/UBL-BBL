import React, { useState } from 'react'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'

function App () {
  const [inputJson, setInputJson] = useState('')
  const [response, setResponse] = useState('')
  const [showSignupModel, setShowSignupModel] = useState(false)
  const [showLoginModel, setShowLoginModel] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true)
    setShowLoginModel(false)
  }

  return (
    <>
      <div className='container'>
        <div className='colour colour1' />
        <div className='colour colour2' />
        <div className='colour colour3' />
      </div>
      <header className='header'>
        {isLoggedIn
          ? (
            <>
              <div className='unlocked-button'>
                <button className='create-order-button'>Create Order</button>
                <button className='create-invoice-button'>Create Invoice</button>
                <button className='validate-invoice-button'>Validate Invoice</button>
              </div>
              <div className='header-right-buttons'>
                <button className='profile-button'>Profile</button>
                <button className='logout-button' onClick={() => setIsLoggedIn(false)}>Logout</button>
              </div>
            </>
            )
          : (
            <>
              <button className='login-button' onClick={() => setShowLoginModel(true)}>Login</button>
              <button className='signup-button' onClick={() => setShowSignupModel(true)}>Signup</button>
            </>
            )}
      </header>
      <div className='app-container'>
        <main className='main-content'>
          <div className='title-container'>
            <h1 className='main-title'>Minvoicing</h1>
            <p className='subtitle'>Making invoices a minimal process.</p>
          </div>
        </main>
      </div>

      <SignUp
        isOpen={showSignupModel}
        onClose={() => setShowSignupModel(false)}
      />
      <Login
        isOpen={showLoginModel}
        onClose={() => setShowLoginModel(false)}
        onLoginSuccess={handleSuccessfulLogin}
      />
    </>
  )
}

export default App
