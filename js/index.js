const userSearchUrl = 'https://api.github.com/search/users?q='

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#github-form')
    form.addEventListener('submit', e => {
        e.preventDefault()
        const userInput = e.target.search.value
        fetch(userSearchUrl + userInput, {
            method: 'GET',
            header: {
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const searchResults = data.items
            const usersContainer = document.querySelector('#user-list')
            usersContainer.innerHTML = ''
            searchResults.forEach(result => {
                const resultElement = document.createElement('li')
                resultElement.innerHTML = `
                <img class = 'image' src = ${result.avatar_url}/>
                <p class = 'username'>Username: ${result.login}</p>
                <p class = 'profile-link'>Profile link: <span>${result.url}<span></p>
                <hr>
                `
                usersContainer.appendChild(resultElement)

                //Event handler
                const userImages = document.querySelectorAll('#user-list li img')
                userImages.forEach(link => {
                    link.addEventListener('click', e => {
                        fetch(`https://api.github.com/users/${result.login}/repos`, {
                            method: 'GET',
                            header: {
                                Accept: 'application/vnd.github.v3+json'
                            }
                        })
                        .then(response => response.json())
                        .then(reposData => {
                            const reposContainer = document.querySelector('#repos-list')
                            reposContainer.innerHTML = ''
                            reposData.forEach(repo => {
                                const repoName = repo.name
                                const repoList = document.createElement('li')
                                repoList.textContent = repoName
                                reposContainer.appendChild(repoList)
                            })
                        })
                        .catch(err => console.log(err))
                    })
                })
            })
        })
        .catch(error => console.log(error))
        form.reset()
    })
})