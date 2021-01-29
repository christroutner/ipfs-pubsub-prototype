import React from 'react'

const Banner = props => (
  <section id="banner" className="major">
    <div className="inner">
      <header className="major">
        <h1>
          Welcome to the world of
          <br />
          Uncensorable Publishing
        </h1>
      </header>
      <div className="content">
        <p>
          This website is built using{' '}
          <a
            href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-template"
            target="_blank"
            rel="noreferrer"
          >
            this Gatsby template
          </a>
          . It uses{' '}
          <a
            href="https://github.com/Permissionless-Software-Foundation/docker-gatsby-webserver"
            target="_blank"
            rel="noreferrer"
          >
            this web server
          </a>{' '}
          to deliver the site over{' '}
          <a href="https://ipfs.io" target="_blank" rel="noreferrer">
            IPFS
          </a>
          ,{' '}
          <a
            href="https://www.torproject.org/"
            target="_blank"
            rel="noreferrer"
          >
            Tor
          </a>
          , and the clear web, simultaniously. Tor makes is accessible
          privately. IPFS makes it easy to replicate and hard to censor.
        </p>
      </div>

      <div className="content">
        <p>
          This is just a <a href="https://www.gatsbyjs.com/docs/" target="_blank"
          rel="noreferrer">GatsbyJS</a> template. Fork{' '}
          <a
            href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-template"
            target="_blank"
            rel="noreferrer"
          >
            the code making up this website
          </a>{' '}
          to create your own uncensorable website! Watch the videos below to
          learn more about uncensorable publishing technology.
        </p>
      </div>
    </div>
  </section>
)

/*
// Call-to-action button.
<ul className="actions">
    <li><a href="#one" className="button next scrolly">Get Started</a></li>
</ul>
*/
export default Banner
