import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { customerService } from './services/customerService'

// Temporary reset to ensure only 5 mock customers are generated as requested
if (!localStorage.getItem('event_crm_reset_5')) {
  localStorage.removeItem('event_crm_customers');
  localStorage.removeItem('event_crm_activities');
  localStorage.setItem('event_crm_reset_5', 'true');
}

// Initialize local storage mock data if empty
customerService.initializeDemoData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
