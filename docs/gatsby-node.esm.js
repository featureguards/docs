import { existsSync } from 'fs'

// Make sure the data directory exists
export function onPreBootstrap({ reporter }) {
  const contentPath = 'data/index.html.md'

  if (!existsSync(contentPath)) {
    reporter.panic(`File not found - Make sure you have data/index.html.md file`)
  }
}

// Creating a page with  docs/index.md file
export async function createPages({ actions, graphql, reporter }) {
  // Check for title and language tabs
  const result = await graphql(`
    query {
      markdownRemark(fileAbsolutePath: {ne: "docs/index.md"}) {
        frontmatter {
          language_tabs
          title
        }
      }
    }  
  `)

  if (result.errors) {
    reporter.panic("Missing required paraneters (Make sure your markdown has title and language_tabs)")
    return
  }


  const basePath = '/'
  const docTemplate = require.resolve(`./src/templates/docs.jsx`)

  actions.createPage({
    path: basePath,
    component: docTemplate,
  })
}
