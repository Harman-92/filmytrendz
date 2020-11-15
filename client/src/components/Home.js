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
                        } else if(res.status === 401){
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
                <div style={{paddingBottom: "2%"}}>
                    <h1 className='homePageTitle'>Recommended Movies</h1>
                    {
                        recommendMovies.length > 0 ?
                            <Card.Group itemsPerRow={5}>
                                {
                                    recommendMovies.map((movie, index) => (
                                        <MovieCard key={index} movie={movie} history={history}/>
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
        <Image src={movie.url === ''?images.no_image:movie.url}/>
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
