import React from 'react'

const Banner = (props) => (
    <section id="banner" className="major">
        <div className="inner">
            <header className="major">
                <h1>Welcome to the world of<br />Uncensorable Publishing</h1>
            </header>
            <div className="content">
              <p>
                This website is built
                using <a href="https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-template" target="_blank" rel="noreferrer">this Gatsby template</a>. It
                uses <a href="https://github.com/Permissionless-Software-Foundation/ipfs-web-server" target="_blank" rel="noreferrer">this web server</a> to
                deliver the site over <a href="https://ipfs.io" target="_blank" rel="noreferrer">IPFS</a>, <a href="https://www.torproject.org/" target="_blank" rel="noreferrer">Tor</a>, and
                the clear web, simultaniously. This makes it effectively uncensorable.
              </p>
            </div>

            <div className="content">
              <p>
                This is just a template. The code making up this website is intended
                to be forked to allow you to create your own uncensorable website.
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
