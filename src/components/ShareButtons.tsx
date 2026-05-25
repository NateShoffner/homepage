'use client'

import { XShareButton, FacebookShareButton, LinkedinShareButton } from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faFacebook, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

type Props = { title: string }

export default function ShareButtons({ title }: Props) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="share-buttons">
      <XShareButton url={url} title={title}>
        <span className="share-btn"><FontAwesomeIcon icon={faXTwitter} /></span>
      </XShareButton>
      <FacebookShareButton url={url}>
        <span className="share-btn"><FontAwesomeIcon icon={faFacebook} /></span>
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={title}>
        <span className="share-btn"><FontAwesomeIcon icon={faLinkedinIn} /></span>
      </LinkedinShareButton>
    </div>
  )
}
