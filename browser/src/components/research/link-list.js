/* eslint-disable */
/*
  Creates list of links for research page.
*/

import React from 'react'
import PostLink from '../post-link'
import { StaticQuery, graphql } from 'gatsby'
import Collapsible from 'react-collapsible'
import { Link } from 'gatsby'
import styled from 'styled-components'

const StyledCollapsible = styled.div`
  background-color: #8482c426;
  padding: 15px;
`

// Query markdown
// Dev Note: This can not be moved into the component Class.
const componentQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            title
            date
            root
            path
            parent
          }
          fileAbsolutePath
        }
      }
    }
  }
`

class LinkList extends React.Component {
  constructor(props) {
    super(props)
  }

  // This actually renders the component.
  componentJSX = data => {
    //console.log(`data: ${JSON.stringify(data,null,2)}`)

    const edges = data.allMarkdownRemark.edges

    // Filter Blog posts. Posts have dates. Research pages don't.
    const researchArticles = edges.filter(edge => !edge.node.frontmatter.date)
    //console.log(`researchPosts: ${JSON.stringify(researchArticles,null,2)}`)

    // Generate an array of research parents.
    const parentTopics = this.getResearchParents(researchArticles)
    //console.log(`parentItems: ${JSON.stringify(parentItems,null,2)}`)

    // For each parent, create a list of links.
    const linkObjs = this.generateLinks(parentTopics, researchArticles)
    //console.log(`linkObjs: ${JSON.stringify(linkObjs,null,2)}`)

    const ResearchParents = parentTopics.map((parent, index) => {
      //console.log(`index: ${index}`)

      return (
        <StyledCollapsible key={parent}>
          <Collapsible key={parent} trigger={parent}>
            <ul>{linkObjs[index].linkHtml}</ul>
          </Collapsible>
        </StyledCollapsible>
      )
    })

    return <div>{ResearchParents}</div>
  }

  render() {
    return (
      <ul>
        <StaticQuery query={componentQuery} render={this.componentJSX} />
      </ul>
    )
  }

  // Given an array of research items, it returns an array of research topic
  // parents.
  getResearchParents(items) {
    const researchParents = []

    for (let i = 0; i < items.length; i++) {
      const thisItem = items[i].node.frontmatter
      const thisParent = thisItem.parent

      if (researchParents.indexOf(thisParent) === -1)
        researchParents.push(thisParent)
    }

    return researchParents
  }

  // Generate an array of objects with links for the research parents and
  // individual research articles.
  generateLinks(parentTopics, researchArticles) {
    const linkObjs = []

    //console.log(`researchArticles: ${JSON.stringify(researchArticles,null,2)}`)
    //console.log(`parentTopics: ${JSON.stringify(parentTopics,null,2)}`)

    // Loop over each research parent.
    for(let i=0; i < parentTopics.length; i++) {
      const thisParent = parentTopics[i]

      const linkObj = {
        parent: thisParent,
        childLinks: [],
        linkHtml: []
      }

      // Loop over each article
      for(let j=0; j < researchArticles.length; j++) {
        const thisArticle = researchArticles[j]

        if(thisArticle.node.frontmatter.parent === thisParent) {
          const path = thisArticle.node.frontmatter.path
          const title = thisArticle.node.frontmatter.title

          linkObj.childLinks.push(path)

          linkObj.linkHtml.push(<li key={path}><Link to={path}>{title}</Link></li>)
        }
      }

      linkObjs.push(linkObj)
    }

    return linkObjs
  }
}

export default LinkList
