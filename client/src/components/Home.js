import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container, Image} from "semantic-ui-react";

import { useHistory, useLocation } from "react-router-dom";
import images from "../config/images";
const src = images.no_image
const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    useEffect(() => {
        if(location.isSearch){
            console.log(location.keyword)
            //TODO:API call to search
        }
        if(location.isLogin){
            setIsLogin(true)
        }
    })

    const [recommendMovies, setRecommendMovies] = useState([
        {id:1, image:'/poster.jpg',title:'Spider Man-1',Genre:'Fiction', Director:'Abc'},
        {id:2, image:'/poster.jpg',title:'Spider Man-2',Genre:'Fiction', Director:'Abc'},
        {id:3, image:'/poster.jpg',title:'Spider Man-3',Genre:'Fiction', Director:'Abc'},
        {id:4, image:'/poster.jpg',title:'Spider Man-4',Genre:'Fiction', Director:'Abc'},
        {id:5, image:'/poster.jpg',title:'Spider Man-5',Genre:'Fiction', Director:'Abc'},
        {id:6, image:'/poster.jpg',title:'Spider Man-6',Genre:'Fiction', Director:'Abc'},
        {id:7, image:'/poster.jpg',title:'Spider Man-7',Genre:'Fiction', Director:'Abc'},
        {id:8, image:'/poster.jpg',title:'Spider Man-4',Genre:'Fiction', Director:'Abc'},
        {id:9, image:'/poster.jpg',title:'Spider Man-5',Genre:'Fiction', Director:'Abc'},
        {id:10, image:'/poster.jpg',title:'Spider Man-6',Genre:'Fiction', Director:'Abc'},
    ])

    const [lastestdMovies, setLastestdMovies] = useState([
        {id:1, image:'/poster.jpg',title:'Spider Man-1',Genre:'Fiction', Director:'Abc'},
        {id:2, image:'/poster.jpg',title:'Spider Man-2',Genre:'Fiction', Director:'Abc'},
        {id:3, image:'/poster.jpg',title:'Spider Man-3',Genre:'Fiction', Director:'Abc'},
        {id:4, image:'/poster.jpg',title:'Spider Man-4',Genre:'Fiction', Director:'Abc'},
        {id:5, image:'/poster.jpg',title:'Spider Man-5',Genre:'Fiction', Director:'Abc'},
        {id:6, image:'/poster.jpg',title:'Spider Man-6',Genre:'Fiction', Director:'Abc'},
        {id:7, image:'/poster.jpg',title:'Spider Man-7',Genre:'Fiction', Director:'Abc'},
        {id:8, image:'/poster.jpg',title:'Spider Man-4',Genre:'Fiction', Director:'Abc'},
        {id:9, image:'/poster.jpg',title:'Spider Man-5',Genre:'Fiction', Director:'Abc'},
        {id:10, image:'/poster.jpg',title:'Spider Man-6',Genre:'Fiction', Director:'Abc'},
    ])

    return (
        <Container className='container'>

            {
                isLogin ?
                    <div style={{paddingBottom: "2%"}}>
                        <h1 className='homePageTitle'>Recommended Movies</h1>
                        <Card.Group itemsPerRow={5}>
                            {
                                recommendMovies.map((movie,index) => (
                                    <Card key={index} onClick={() => history.push('/movie/' + movie.id)}>
                                        <Image src={movie.image}/>
                                    </Card>
                                ))
                            }
                        </Card.Group>
                    </div> : null
            }

            <h1 className='homePageTitle'>Latest Movies</h1>
            <Card.Group itemsPerRow={5}>
                {
                    lastestdMovies.map((movie,index) => (
                        <Card className='movieCard' key={index} onClick={() => history.push('/movie/' + movie.id)}>
                            <Image src={movie.image}/>
                        </Card>
                    ))
                }
            </Card.Group>
        </Container>
    );
}
Home.propTypes = {};

Home.defaultProps = {};

export default Home;
