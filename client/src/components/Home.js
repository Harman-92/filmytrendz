import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container, Divider, Icon, Image} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated} from "../config/session";

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [recommendMovies, setRecommendMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'This is a very long movie name', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 6, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 7, image: '/poster.jpg', title: 'Spider Man-7', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 8, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 9, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 10, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    ])

    const [populardMovies, setPopularMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 6, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 7, image: '/poster.jpg', title: 'Spider Man-7', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 8, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 9, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 10, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    ])
    const [lastestdMovies, setLastestdMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    ])


    useEffect(() => {
        if (location.isSearch) {
            console.log(location.keyword)
            console.log(location.filter)
            //TODO:API call to search
        }
    }, [location.isSearch, location.keyword, location.filter])
    useEffect(() => {
        setIsLogin(isAuthenticated())
        if (isLogin) {
            //TODO: API to get user recommended movies
        } else {
            //TODO: API to get latest movies
        }
    }, [location, isLogin])

    return (
        <Container className='container'>

            {
                isLogin ?
                    <div style={{paddingBottom: "2%"}}>
                        <h1 className='homePageTitle'>Recommended Movies</h1>
                        <Card.Group itemsPerRow={5}>
                            {
                                recommendMovies.map((movie, index) => (
                                    <Card key={index}>
                                        <Image src={movie.image}/>
                                        <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}
                                                      className='movie-card-content'>
                                            <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                            <Divider className='cardDivider'/>
                                            <Card.Meta className='cardContext'>Released in {movie.releaseYear}</Card.Meta>
                                            <div>
                                                <Icon name='star' inverted color='violet'/> {movie.averageRating}
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Card.Group>
                    </div> : null
            }

            <h1 className='homePageTitle'>Popular Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    populardMovies.map((movie, index) => (
                        <Card className='movieCard' key={index}>
                            <Image src={movie.image}/>
                            <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}
                                          className='movie-card-content'>
                                <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                <Divider className='cardDivider'/>
                                <Card.Meta className='cardContext'>Released in {movie.releaseYear}</Card.Meta>
                                <div>
                                    <Icon name='star' inverted color='violet'/> {movie.averageRating}
                                </div>
                            </Card.Content>
                        </Card>
                    ))
                }
            </Card.Group>

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    lastestdMovies.map((movie, index) => (
                        <Card className='movieCard' key={index}>
                            <Image src={movie.image}/>
                            <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}
                                          className='movie-card-content'>
                                <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                <Divider className='cardDivider'/>
                                <Card.Meta className='cardContext'>Released in {movie.releaseYear}</Card.Meta>
                                <div>
                                    <Icon name='star' inverted color='violet'/> {movie.averageRating}
                                </div>
                            </Card.Content>
                        </Card>
                    ))
                }
            </Card.Group>
        </Container>
    );
}

export default Home;
