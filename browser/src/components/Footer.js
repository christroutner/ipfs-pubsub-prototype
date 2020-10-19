/* eslint-disable */

import React from 'react'

const Footer = props => (
  <footer id="footer">
    <div className="inner">
      <ul className="icons">
        <li>
          <a
            href="https://twitter.com/PSF_DAO"
            className="icon alt  fab fa-twitter"
          >
            <span className="label">Twitter</span>
          </a>
        </li>
        <li>
          <a
            href="https://t.me/permissionless_software"
            className="icon alt  fab fa-telegram"
          >
            <span className="label">Telegram</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Permissionless-Software-Foundation"
            className="icon alt  fab fa-github"
          >
            <span className="label">GitHub</span>
          </a>
        </li>
      </ul>
      <p>
        Template maintained by the{' '}
        <a href="https://psfoundation.cash" target="_blank">
          Permissionless Software Foundation
        </a>
      </p>
    </div>
  </footer>
)

export default Footer
