import React from 'react'

class Media extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div id="main">
        <section>
          <section className="spotlights">
            <section style={{ border: '5px solid black' }}>
              <div className="content">
                <div className="inner">
                  <header className="major break-word">
                    <h3>How Governments Censor Websites</h3>
                  </header>
                  <p>
                    This is a non-technical, high-level overview of how
                    governments engage in censorship. It doesn't focus on any
                    particular country, but focuses on the three most common
                    methods that have historically been used by all countries to
                    restrict their citizens ability to access information on the
                    internet.
                  </p>
                </div>
              </div>
              <div className="youtube-responsive-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/RlNVyatwd5M"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="kickoff"
                  style={{ padding: '10px' }}
                />
              </div>
            </section>

            <section style={{ border: '5px solid black' }}>
              <div className="content">
                <div className="inner">
                  <header className="major break-word">
                    <h3>Fight Censorship with a Site Mirror</h3>
                  </header>
                  <p>
                    The easiest way to fight censorship, and support a site that
                    is in danger of censorship, is to set up a site mirror.{' '}
                    <a
                      href="https://github.com/Permissionless-Software-Foundation/ipfs-site-mirror"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ipfs-site-mirror
                    </a>{' '}
                    is the tool to allow you to easily mirror a site on IPFS.
                    'Mirroring' a site means you are providing another
                    functional copy that can take over if the original is ever
                    taken down.
                  </p>
                  <p>
                    The tool works by following the Bitcoin Cash address of the
                    site. When the site is updated, a change notification will
                    be published to that address. ipfs-site-mirror will
                    automatically detect this change and download it. Once set
                    up, you can completely forget about ipfs-site-mirror. The
                    software will 'just work' and help protect your favorite
                    site from censorship.
                  </p>
                </div>
              </div>
              <div className="youtube-responsive-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/nrtVuk3v1R0"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="kickoff"
                  style={{ padding: '10px' }}
                />
              </div>
            </section>

            <section style={{ border: '5px solid black' }}>
              <div className="content">
                <div className="inner">
                  <header className="major break-word">
                    <h3>Create Your Own Bitcoin Cash Web Wallet</h3>
                  </header>
                  <p>
                    While this website template is great for building a blog or
                    other website, the{' '}
                    <a
                      href="https://github.com/Permissionless-Software-Foundation/bch-wallet-starter"
                      target="_blank"
                      rel="noreferrer"
                    >
                      bch-wallet-starter Gatsby Starter
                    </a>{' '}
                    can be customized to quickly build Bitcoin Cash (BCH) and
                    Bitcoin ABC (BCHA) powered apps. That app template lets you
                    send or recieve both coins and SLP tokens on these two
                    blockchains. It's powered by{' '}
                    <a
                      href="https://fullstack.cash"
                      target="_blank"
                      rel="noreferrer"
                    >
                      FullStack.cash
                    </a>
                    .
                  </p>
                  <p>
                    Just like this template, the wallet app can be
                    simultaniously broadcasted over Tor, IPFS, and the clear
                    web, or any combination of the three. This give you and your
                    users many options for privately and reliably conducting
                    business.
                  </p>
                </div>
              </div>
              <div className="youtube-responsive-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/G7ptg7VIRnk"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="kickoff"
                  style={{ padding: '10px' }}
                />
              </div>
            </section>

            <section style={{ border: '5px solid black' }}>
              <div className="content">
                <div className="inner">
                  <header className="major break-word">
                    <h3>Installing an Uncensorable Web Server</h3>
                  </header>
                  <p>
                    This website is a 'website template', code that you can copy
                    and customize. It's based on the{' '}
                    <a
                      href="https://www.gatsbyjs.com/docs/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GatsbyJS
                    </a>{' '}
                    framework for building web apps. You can fork{' '}
                    <a
                      href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-template"
                      target="_blank"
                      rel="noreferrer"
                    >
                      the code making up this website
                    </a>{' '}
                    to build your own.
                  </p>
                  <p>
                    Once your site is customized, you'll need to deploy it. The
                    video shows you how to set up{' '}
                    <a
                      href="https://github.com/Permissionless-Software-Foundation/docker-gatsby-webserver"
                      target="_blank"
                      rel="noreferrer"
                    >
                      this web server
                    </a>{' '}
                    which will serve your web app over{' '}
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
                    privately. IPFS makes it easy to replicate and hard to
                    censor.
                  </p>
                </div>
              </div>
              <div className="youtube-responsive-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/JJfxYKWV9JQ"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="kickoff"
                  style={{ padding: '10px' }}
                />
              </div>
            </section>

            <section style={{ border: '5px solid black' }}>
              <div className="content">
                <div className="inner">
                  <header className="major break-word">
                    <h3>Building Uncensorable REST APIs</h3>
                  </header>
                  <p>
                    This is a sneak peak of the future of uncensorable
                    publishing. Not only can you use IPFS to make the website
                    difficult to censor, it will eventually be possible to
                    replace REST APIs with an IPFS-based API. This will allow
                    apps to be truely uncensorable, accessed as easily from
                    within the Chinese firewall as they are from Silicon Valley.
                  </p>
                </div>
              </div>
              <div className="youtube-responsive-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/VVc0VbOD4co"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="kickoff"
                  style={{ padding: '10px' }}
                />
              </div>
            </section>
          </section>
        </section>
      </div>
    )
  }
}

export default Media
