/*
  Markdown implementation:
  https://www.gatsbyjs.org/docs/adding-a-list-of-markdown-blog-posts/
*/

import React from 'react'
import PostLink from '../components/post-link'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

import pic11 from '../assets/images/blog.jpg'

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  //console.log(`edges: ${JSON.stringify(edges, null, 2)}`)

  const Posts = edges
    // Filter Blog posts. Posts have dates. Research pages don't.
    .filter(edge => !!edge.node.frontmatter.date)
    .map(edge => <li key={edge.node.id}><PostLink key={edge.node.id} post={edge.node} /></li>)

  return (
    <Layout>
      <Helmet>
        <title>Blog</title>
        <meta name="Blog" content="Blog" />
      </Helmet>

      <div id="main" className="alt">
        <section id="one">
          <div className="inner">
            <header className="major">
              <h1>Blog</h1>
            </header>
            <span className="image main">
              <img src={pic11} alt="" />
            </span>

            <p>
              This page displays all blog entries, sorted by date.
            </p>

            <ul>{Posts}</ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`
