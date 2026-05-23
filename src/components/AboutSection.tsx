'use client'

import { useState, useEffect } from 'react'
import { ReactTyped } from 'react-typed'

export function AboutSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <h1 className="mb-5">
        {mounted ? (
          <ReactTyped
            strings={['Nate <span class="text-highlight">Shoffner</span>']}
            typeSpeed={100}
            showCursor={true}
          />
        ) : null}
      </h1>

      <div className="row">
        <div className="col-12 col-md-12 col-lg-6">
          <h3 className="subheading mb-5">About</h3>
          <p>
            Software engineer based in Lancaster, Pennsylvania. Passionate about
            all things tech, solving interesting problems, learning how things
            work, and [simultaneously] breaking and building things in order to
            create something to be proud of.
          </p>
          <p>
            Currently working at{' '}
            <a href="https://theindustrialresolution.com/">Industrial Resolution</a>{' '}
            as a Senior Software /{' '}
            <a href="https://certified.elastic.co/d2170b39-7c27-4811-952f-3085d6a0dda5">
              Elastic Certified Engineer
            </a>
            .
          </p>
          <p className="mb-5">
            I enjoy working on lots of little passion projects which you can find on
            my <a href="https://github.com/nateshoffner">GitHub</a> and getting
            involved within my{' '}
            <a href="https://techlancaster.com/">local tech scene</a>.
          </p>
        </div>
        <div className="col-12 col-md-12 col-lg-6">
          <h3 className="subheading mb-5">Interests</h3>
          <div className="d-lg-inline-flex flex-row">
            <ul className="highlighted inlined-list">
              <li>Full-Stack Development</li>
              <li>Reverse Engineering</li>
              <li>Homelabbing</li>
              <li>API Development</li>
              <li>Elasticsearch</li>
              <li>Home Automation</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutSection
