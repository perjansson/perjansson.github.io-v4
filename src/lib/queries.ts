export const getIndexPageDataQuery = `{
    me(id: "6DJvlbWzPKLgZvCzVDRzos") {
        firstName
        lastName
        name
        title
        short { json }
        long { json }
        contacts: contactsCollection {
            items {
                ... on Contact {
                    medium
                    url
                }
            }
        }
    }
    projects: projectCollection(order: startdate_DESC) {
        items {
            sys {
                id
            }
            title
            titleShort
            client
            role
            city
            tech
            startdate
            enddate
            promoted
            asset {
                url
            }
            assetPlaceholder
        }
    }
}`

export const getAllProjectsQuery = `{
    projects: projectCollection(order: startdate_DESC) {
        items {
            sys {
                id
            }
        }
    }
}`

export const getProjectPageDataQuery = (id: string) => `{
    project(id: "${id}") {
        title
        titleShort
        client
        description { json }
        me { json }
        role
        startdate
        enddate
        city
        tech
        links
        asset {
            url
        }
        assetPlaceholder
        collaborators: collaboratorsCollection {
            items {
                name
                company
                linkedin
            }
        }
    }
}`
