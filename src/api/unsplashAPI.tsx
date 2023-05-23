
const imgCount = 12
const ACCESS_KEY = 'jUUTdQf2BhiEUB5lrVGVArE_8OfRV-4SSOc1FZGIBOs'

const fetchImages = async () => {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&count=${imgCount}`)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.error('Error fetching images:', error)
    }
}

const fetchUserPhotos = async (username: string) => {
    try {
        const response = await fetch(`https://api.unsplash.com/users/${username}/photos?client_id=${ACCESS_KEY}`)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.error('Error fetching images:', error)
    }
}

const search = async (word: string) => {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${word}&client_id=${ACCESS_KEY}&per_page=${imgCount}`);
        const data = await response.json()
        console.log(data.results)
        return data.results
    } catch (error) {
        console.log('Error searching images:', error)
    }
}


export { fetchImages, fetchUserPhotos, search }