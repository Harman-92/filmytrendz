import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../style/Home.css';
import {Card, Container, Divider, Icon, Image} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated} from "../config/session";
import api from "../config/axios"
import response from "../config/response";
import images from "../config/images";

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(isAuthenticated)
    const [recommendMovies, setRecommendMovies] = useState([])
    const [latestMovies, setLatestMovies] = useState([])

    useEffect(() => {

        api.get('/movie?latest=true').then((res) => {
            if (res.status === 200) {
                setLatestMovies(res.data.movies)
                if (isAuthenticated()) {
                    setIsLogin(isAuthenticated())
                    api.get('/recommend/user').then((res) => {
                        if (res.status === 200) {
                            console.log("recommend results: " + res.data.movies)
                            setRecommendMovies(res.data.movies)
                        } else if (res.status === 401) {
                            history.go(0)
                        } else {
                            console.log(response.SERVER_ERROR)
                        }
                    }).catch(() => {
                        console.log(response.SERVER_UNAVAILABLE)
                    })
                }
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })

    }, [location])

    return (
        <Container className='container'>
            {isLogin ?

                recommendMovies.length > 0 ?
                    <div style={{paddingBottom: "2%"}}>
                        <h1 className='homePageTitle'>Recommended Movies</h1>
                        <Card.Group itemsPerRow={5}>
                            {
                                recommendMovies.map((movie, index) => (
                                    <MovieCard key={index} movie={movie} history={history}/>
                                ))
                            }
                        </Card.Group>

                    </div> : null
                :
                <div style={{display: "flex", flexDirection: 'column',alignItems: 'center'}}>
                    <div className='guideText'>
                        <p className='guideContext'>Track films you’ve watched and reviewed.</p>
                        <p className='guideContext'>Save those you want to see.</p>
                        <p className='guideContext'>Tell your friends what’s good.</p>
                        <p className='guideContext'>Just
                            <span className='emphasizeText'> Register and Login </span>
                            to explore more in Filmytrendz!</p>
                    </div>
                </div>
            }

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    latestMovies.map((movie, index) => (
                        index < 20 ? <MovieCard key={index} movie={movie} history={history}/> : null
                    ))
                }
            </Card.Group>
        </Container>
    );
}

const MovieCard = ({movie, history}) => (
    <Card className='movieCard'>
        <Image src={movie.url === '' ? images.no_image : movie.url}/>
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

MovieCard.propTypes = {
    movie: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

export default Home;
