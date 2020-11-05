import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container, Divider, Icon, Image} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated} from "../config/session";
import api from "../config/axios"

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(isAuthenticated)
    const [recommendMovies, setRecommendMovies] = useState([
        {
            id: 1,
            image: '/poster.jpg',
            title: 'This is a very long movie name',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 2,
            image: '/poster.jpg',
            title: 'Spider Man-2',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 3,
            image: '/poster.jpg',
            title: 'Spider Man-3',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 4,
            image: '/poster.jpg',
            title: 'Spider Man-4',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 5,
            image: '/poster.jpg',
            title: 'Spider Man-5',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 6,
            image: '/poster.jpg',
            title: 'Spider Man-6',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 7,
            image: '/poster.jpg',
            title: 'Spider Man-7',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 8,
            image: '/poster.jpg',
            title: 'Spider Man-4',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 9,
            image: '/poster.jpg',
            title: 'Spider Man-5',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 10,
            image: '/poster.jpg',
            title: 'Spider Man-6',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
    ])

    // const [popularMovies, setPopularMovies] = useState([
    //     {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 6, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 7, image: '/poster.jpg', title: 'Spider Man-7', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 8, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 9, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    //     {id: 10, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc', releaseYear: '1991', averageRating: 4.5},
    // ])
    const [latestMovies, setLatestMovies] = useState([])


    useEffect(() => {
        if (location.isSearch) {
            console.log(location.keyword)
            console.log(location.filter)
            //TODO:API call to search
        }
    }, [location.isSearch, location.keyword, location.filter])
    useEffect(() => {
        if (isAuthenticated()) {
            setIsLogin(isAuthenticated())
            //TODO: API to get user recommended movies
        }
        api.get('/movie?latest=true').then((res) => {
            if (res.status === 200) {
                setLatestMovies(res.data.movies)
            } else {
                alert('error')
            }
        }).catch((e) => {
            console.log('Internal server error')
        })

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
                                        <Image src={movie.url}/>
                                        <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}
                                                      className='movie-card-content'>
                                            <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                            <Divider className='cardDivider'/>
                                            <Card.Meta className='cardContext'>Released in {movie.year}</Card.Meta>
                                            <div>
                                                <Icon name='star' inverted color='violet'/> {movie.rating}
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Card.Group>
                    </div> : null
            }

            {/*<h1 className='homePageTitle'>Popular Movies</h1>*/}
            {/*<Card.Group itemsPerRow={5}>*/}
            {/*    {*/}
            {/*        popularMovies.map((movie, index) => (*/}
            {/*            <Card className='movieCard' key={index}>*/}
            {/*                <Image src={movie.url}/>*/}
            {/*                <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}*/}
            {/*                              className='movie-card-content'>*/}
            {/*                    <Card.Header className='cardContext'>{movie.title}</Card.Header>*/}
            {/*                    <Divider className='cardDivider'/>*/}
            {/*                    <Card.Meta className='cardContext'>Released in {movie.year}</Card.Meta>*/}
            {/*                    <div>*/}
            {/*                        <Icon name='star' inverted color='violet'/> {movie.rating}*/}
            {/*                    </div>*/}
            {/*                </Card.Content>*/}
            {/*            </Card>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</Card.Group>*/}

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    latestMovies.map((movie, index) => (
                        <Card className='movieCard' key={index}>
                            <Image src={movie.url}/>
                            <Card.Content as={'div'} onClick={() => history.push('/movie/' + movie.id)}
                                          className='movie-card-content'>
                                <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                <Divider className='cardDivider'/>
                                <Card.Meta className='cardContext'>Released in {movie.year}</Card.Meta>
                                <div>
                                    <Icon name='star' inverted color='violet'/> {movie.rating}
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
