import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Kindle Notes Frontend' })).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const button = screen.getByRole('button', { name: /count is 0/ })
    expect(button).toBeInTheDocument()
    
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/ })).toBeInTheDocument()
  })
})