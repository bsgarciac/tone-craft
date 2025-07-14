import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Loader from '../ui/Loader'

describe('Loader Component', () => {
  it('renders the loader component', () => {
    const { container } = render(<Loader />)
    
    // Check that the loader container is rendered
    expect(container.firstChild).toBeDefined()
  })
}) 