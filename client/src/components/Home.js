import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container, Image} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated} from "../config/session";

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [recommendMovies, setRecommendMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc',},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc'},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc'},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc'},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc'},
        {id: 6, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc'},
        {id: 7, image: '/poster.jpg', title: 'Spider Man-7', genre: 'Fiction', director: 'Abc'},
        {id: 8, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc'},
        {id: 9, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc'},
        {id: 10, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc'},
    ])

    const [populardMovies, setPopularMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc',},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc'},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc'},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc'},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc'},
        {id: 6, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc'},
        {id: 7, image: '/poster.jpg', title: 'Spider Man-7', genre: 'Fiction', director: 'Abc'},
        {id: 8, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc'},
        {id: 9, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc'},
        {id: 10, image: '/poster.jpg', title: 'Spider Man-6', genre: 'Fiction', director: 'Abc'},
    ])
    const [lastestdMovies, setLastestdMovies] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', genre: 'Fiction', director: 'Abc',},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', genre: 'Fiction', director: 'Abc'},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', genre: 'Fiction', director: 'Abc'},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', genre: 'Fiction', director: 'Abc'},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', genre: 'Fiction', director: 'Abc'},
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
                                    <Card key={index} onClick={() => history.push('/movie/' + movie.id)}>
                                        <Image src={movie.image}/>
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
                        <Card className='movieCard' key={index} onClick={() => history.push('/movie/' + movie.id)}>
                            <Image src={movie.image}/>
                        </Card>
                    ))
                }
            </Card.Group>

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    lastestdMovies.map((movie, index) => (
                        <Card className='movieCard' key={index} onClick={() => history.push('/movie/' + movie.id)}>
                            <Image src={movie.image}/>
                        </Card>
                    ))
                }
            </Card.Group>
        </Container>
    );
}

export default Home;
