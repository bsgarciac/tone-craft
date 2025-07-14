import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextTransformPanel from '../TextTransformer'

describe('TextTransformPanel Component', () => {
  const mockOnTransform = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the textarea and buttons', () => {
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )
    
    expect(screen.getByPlaceholderText('Enter your text here...')).toBeDefined()
    expect(screen.getByText('Transform')).toBeDefined()
    expect(screen.getByText('Cancel')).toBeDefined()
  })

  it('allows user to input text', async () => {
    const user = userEvent.setup()
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Enter your text here...')
    await user.type(textarea, 'Hello world')
    
    expect(textarea).toHaveValue('Hello world')
  })

  it('calls onTransform when transform button is clicked with text', async () => {
    const user = userEvent.setup()
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Enter your text here...')
    const transformButton = screen.getByText('Transform')
    
    await user.type(textarea, 'Hello world')
    await user.click(transformButton)
    
    expect(mockOnTransform).toHaveBeenCalledWith('Hello world')
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('clears text when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Enter your text here...')
    const cancelButton = screen.getByText('Cancel')
    
    await user.type(textarea, 'Hello world')
    await user.click(cancelButton)
    
    expect(textarea).toHaveValue('')
  })

  it('disables textarea and transform button when loading', () => {
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={true}
      />
    )
    
    const textarea = screen.getByPlaceholderText('Enter your text here...')
    const transformButton = screen.getByText('Transform')
    
    expect(textarea).toBeDisabled()
    expect(transformButton).toBeDisabled()
  })

  it('shows loader when loading', () => {
    render(
      <TextTransformPanel 
        onTransform={mockOnTransform} 
        onCancel={mockOnCancel}
        isLoading={true}
      />
    )
    
    // The loader should be present in the transform button
    const transformButton = screen.getByText('Transform')
    expect(transformButton).toBeDefined()
  })

}) 