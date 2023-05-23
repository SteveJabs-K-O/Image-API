import { useState, useEffect } from 'react'
import { Container, Card, Button, Modal } from 'react-bootstrap'
import './app.css'

export type Image = {
    urls: {
        regular: string
        full: string
    }
    alt_description: string
    width: number
    height: number
    user: {
        username: string
    }
}

function App() {
    const [images, setImages] = useState<Image[]>([])
    const [input, setInput] = useState('')
    const [selectedImage, setSelectedImage] = useState<Image | null>(null)
    const [headerOpacity, setHeaderOpacity] = useState(1)
    const [random, setRandom] = useState(true)
    const imgCount = 12
    const ACCESS_KEY = 'jUUTdQf2BhiEUB5lrVGVArE_8OfRV-4SSOc1FZGIBOs'

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            const header = document.querySelector('header') as HTMLElement
            const headerHeight = header.offsetHeight
            const headerOpacity = Math.max(0.5, 1 - scrollPosition / headerHeight)
            setHeaderOpacity(headerOpacity)
        };
    
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const fetchImages = async () => {
        try {
            const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&count=${imgCount}`)
            const data = await response.json()
            console.log(data)
            setImages(data)
        } catch (error) {
            console.error('Error fetching images:', error)
        }
    }

    const fetchUserPhotos = async (username: string) => {
        try {
            const response = await fetch(`https://api.unsplash.com/users/${username}/photos?client_id=${ACCESS_KEY}`)
            const data = await response.json()
            console.log(data)
            setImages(data)
        } catch (error) {
            console.error('Error fetching images:', error)
        }
    }

    const search = async (word: string) => {
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${word}&client_id=${ACCESS_KEY}&per_page=${imgCount}`);
            const data = await response.json()
            console.log(data.results)
            setImages(data.results)
        } catch (error) {
            console.log('Error searching images:', error)
        }
    }

    const handleRandomImage = () => {
        fetchImages()
        setRandom(true)
    }

    const handleCardClick = (image: Image) => {
        setSelectedImage(image)
    }
    
    const handleCloseModal = () => {
        setSelectedImage(null)
    }

    const handleSearch = () => {
        
        search(input)
        setInput('')
    }

    const handleUserPhotos = (username: string) => {
        console.log('handleUserCollection')
        fetchUserPhotos(username)
        setRandom(false)
        handleCloseModal()
    }

    useEffect(() => {
        fetchImages()
        setRandom(true)
    }, [])

    return (
        <>
            <header className='d-flex justify-content-center' style={{ opacity: headerOpacity }}>
                <div className='py-3 px-5 text-black d-inline-flex'>
                    <a className='home d-inline-flex' href='#' onClick={handleRandomImage}>
                        <img 
                            src='/cam-icon.svg' 
                            className='img-icon d-inline' 
                            alt='Camera Icon' 
                        />
                        <h1 className='my-0 py-3'>Image API</h1>
                    </a>
                    <Container className='d-flex'>
                        <input 
                            className='my-auto mx-2' 
                            type='text' 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onClick={() => setHeaderOpacity(1)} 
                        />
                        <Button 
                            className='my-auto text-grey' 
                            onClick={handleSearch}
                        >   
                            Search
                        </Button>
                    </Container>
                </div>
            </header>
            <h2 className='d-flex justify-content-center text-white'>{random? '': `${images[0].user.username} photos`}</h2>
            <Container className='d-flex pt-50px p-3 gap-4 flex-wrap align-content-start justify-content-evenly'>
                {images.map((image, index) => (
                <Card 
                    key={index} 
                    className='p-0 w-auto h-auto d-flex bg-transparent my-auto' 
                    onClick={() => handleCardClick(image)} 
                >
                    <Card.Img 
                        src={image.urls.regular} 
                        alt={image.alt_description}
                        className='d-flex' 
                        style={{
                            width: image.width/20
                        }} 
                    />              
                </Card>
                ))}
            </Container>    
            <Modal show={selectedImage !== null} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Full-size Image</Modal.Title>
                </Modal.Header>
                {selectedImage && (
                <Modal.Body className={`overflow-hidden px-auto h-${selectedImage.height < 500 ? 'auto':''}`}>
                    <img 
                        src={selectedImage.urls.full} 
                        alt={selectedImage.alt_description} 
                        onClick={() => handleUserPhotos(selectedImage.user.username)}
                        className='d-flex m-auto border border-dark' />
                </Modal.Body>
                )}
                <p className='d-flex justify-content-center mt-0'>Click image to see the user photos.</p>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default App
