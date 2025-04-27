import React, { useState, useEffect } from 'react'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'
import CreateInvoice from './components/CreateInvoice2'
import ValidateInvoice from './components/ValidateInvoice'
import ParseOrderToJson from './components/ParseOrderToJson'
import InvoiceList from './components/InvoiceList'

function App () {
  const [showSignupModel, setShowSignupModel] = useState(false)
  const [showLoginModel, setShowLoginModel] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true)
    setShowLoginModel(false)
    setActivePage('dashboard')
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleCreateInvoice = () => {
    setActivePage('createInvoice')
    setMenuOpen(false)
  }

  const handleValidateInvoice = () => {
    setActivePage('validateInvoice')
    setMenuOpen(false)
  }

  const handleParseOrder = () => {
    setActivePage('parseOrder')
    setMenuOpen(false)
  }

  const returnToDashboard = () => {
    setActivePage('dashboard')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.menu-panel') &&
          !event.target.closest('.hamburger-menu')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  const renderDashboardContent = () => {
    switch (activePage) {
      case 'createInvoice':
        return <CreateInvoice onClose={returnToDashboard} />
      case 'validateInvoice':
        return <ValidateInvoice onClose={returnToDashboard} />
      case 'parseOrder':
        return <ParseOrderToJson onClose={returnToDashboard} />
      case 'dashboard':
      default:
        return (
          <div className='dashboard-content'>
            <h1 className='dashboard-title'>Welcome back!</h1>
            <InvoiceList />
          </div>
        )
    }
  }

  return (
    <>
      <div className='container'>
        <div className='colour colour1' />
        <div className='colour colour2' />
        <div className='colour colour3' />
      </div>
      {menuOpen && <div className='menu-overlay' onClick={() => setMenuOpen(false)} />}
      <header className='header'>
        {isLoggedIn
          ? (
            <>
              <div className='hamburger-menu' onClick={toggleMenu}>
                <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className={`menu-panel ${menuOpen ? 'open' : ''}`}>
                <div className='menu-buttons'>
                  <button className='menu-button' onClick={handleParseOrder}>Create Order</button>
                  <button className='menu-button' onClick={handleCreateInvoice}>Create Invoice</button>
                  <button className='menu-button' onClick={handleValidateInvoice}>Validate Invoice</button>
                  <div className='menu-divider' />
                  <button className='menu-button'>Profile</button>
                </div>
              </div>
              <div className='header-right-buttons'>
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
        {isLoggedIn ? (
          <>
            <div className='logged-in-title'>
              <button className='logged-title' onClick={() => setActivePage('dashboard')}>Minvoicing</button>
            </div>
            <main className='dashboard'>
              {renderDashboardContent()}
            </main>
          </>
        ) : (
          <>
            <div className='landing-container'>
              <section className='hero-section'>
                <div className='title-container'>
                  <h1 className='main-title'>Minvoicing</h1>
                  <p className='subtitle'>Making invoices a minimal process.</p>
                </div>
              </section>

              {/* <section className="about-section">
          <div className="about-content">
            <h2>About Us</h2>
            <p>Your about content here...</p>
          </div>
        </section> */}
            </div>
          </>
        )}
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
