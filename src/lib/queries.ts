export const getIndexPageDataQuery = `{
    me(id: "6DJvlbWzPKLgZvCzVDRzos") {
        firstName
        lastName
        name
        title
        profileImage {
            fileName
            url
        }
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
            titleShort
            client
            role
            tech
            startdate
            enddate
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
        tags
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
