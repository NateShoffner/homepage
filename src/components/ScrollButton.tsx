'use client'

import { Link } from 'react-scroll'

interface ScrollButtonProps {
  target?: string
}

function ScrollButton({ target = '' }: ScrollButtonProps) {
  return (
    <div className="scroll-btn">
      <Link to={target} smooth={true} duration={500} className="centered" style={{ cursor: 'pointer' }}>
        <span className="scroll-down"></span>
      </Link>
    </div>
  )
}

export default ScrollButton
