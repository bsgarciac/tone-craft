import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ToneCard from '../ToneCard'

describe('ToneCard Component', () => {
  const defaultProps = {
    imageUrl: '/test-image.svg',
    title: 'Test Tone',
    description: 'This is a test description for the tone card.',
    altText: 'Test Alt Text'
  }

  it('renders the card with all props', () => {
    render(<ToneCard {...defaultProps} />)
    
    expect(screen.getByText('Test Tone')).toBeDefined()
    expect(screen.getByText('This is a test description for the tone card.')).toBeDefined()
    expect(screen.getByAltText('Test Alt Text')).toBeDefined()
  })
}) 