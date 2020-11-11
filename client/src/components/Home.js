import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container, Divider, Icon, Image} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated, getUserInfo, getAccessToken} from "../config/session";
import api from "../config/axios"

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(isAuthenticated)

    const [recommendMovies, setRecommendMovies] = useState([])

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
            api.get('/recommend/user', {
                headers: {'Authorization': getAccessToken()}
                }).then((res) => {
                if (res.status === 200) {
                    console.log("recommend results: " + res.data.movies)
                    setRecommendMovies(res.data.movies)
                } else {
                    alert('error')
                }
            }).catch((e) => {
                console.log("error is: " + e)
            })
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
                        {
                            recommendMovies.length > 0 ?
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
                        </Card.Group> :
                                <div className='recommendText'>
                                    <p>Opps! There are no recommended movies for you now. </p>
                                    <p>Enjoy your film travel and share your life in film.</p>
                                </div>
                        }

                    </div> : null
            }

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    latestMovies.map((movie, index) => {
                        if (index < 20) {
                            return (
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
                            )
                        }
                    })
                }
            </Card.Group>
        </Container>
    );
}

export default Home;
