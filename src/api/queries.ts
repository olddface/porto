export const PORTFOLIO_QUERY = `
  query GetPortfolio {
    profilesCollection(first: 1, orderBy: [{ created_at: DescNullsLast }]) {
      edges {
        node {
          name
          title
          years_experience
          location
          tagline
          about
          email
          resume
          social_linksCollection(orderBy: [{ sort_order: AscNullsLast }]) {
            edges {
              node {
                label
                href
              }
            }
          }
          experiencesCollection(orderBy: [{ sort_order: AscNullsLast }]) {
            edges {
              node {
                company
                role
                period
                location
                bullets
              }
            }
          }
          skill_groupsCollection(orderBy: [{ sort_order: AscNullsLast }]) {
            edges {
              node {
                category
                skills
              }
            }
          }
          projectsCollection(orderBy: [{ sort_order: AscNullsLast }]) {
            edges {
              node {
                slug
                name
                description
                details
                highlights
                stack
                repo
                demo
              }
            }
          }
        }
      }
    }
  }
`

export const PROJECT_BY_SLUG_QUERY = `
  query GetProjectBySlug($slug: String!) {
    projectsCollection(filter: { slug: { eq: $slug } }, first: 1) {
      edges {
        node {
          slug
          name
          description
          details
          highlights
          stack
          repo
          demo
        }
      }
    }
  }
`
