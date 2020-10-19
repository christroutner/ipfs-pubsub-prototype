/*
  Markdown implementation:
  https://www.gatsbyjs.org/docs/adding-markdown-pages/

  This template is used to render the post.
*/

import React from "react"
import { graphql } from "gatsby"
import styled from 'styled-components'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

const BlogPostContainer = styled.div`
  padding: 25px;
`

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <Helmet>
        <title>{frontmatter.title}</title>
        <meta name="description" content="Markdown Generated Page" />
      </Helmet>

      <BlogPostContainer className="blog-post-container">
        <div className="blog-post">
          <h1>{frontmatter.title}</h1>
          <h2>{frontmatter.date}</h2>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </BlogPostContainer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
