import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import LinkList from '../components/research/link-list'

import pic11 from '../assets/images/research-header.jpg'

const Research = props => {
  return (
    <Layout>
      <Helmet>
        <title>Research</title>
        <meta name="description" content="Generic Page" />
      </Helmet>

      <div id="main" className="alt">
        <section id="one">
          <div className="inner">
            <header className="major">
              <h1>Research</h1>
            </header>
            <span className="image main">
              <img src={pic11} alt="" />
            </span>

            <div className="grid-wrapper">
              <div className="col-3">
                <LinkList />
              </div>
              <div className="col-9">
                <p>
                  This page contains a list of links to research articles. Unlike
                  blog posts, research articles are listed by the parent topic
                  and not the date.
                </p>
                <p>
                  Click on a research topic to activate the drop-down list of
                  articles under that topic. The link list appears to the left
                  on desktop browsers and at the top of the page for mobile
                  browsers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Research
