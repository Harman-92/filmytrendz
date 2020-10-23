import React, {useEffect, useState} from 'react';
import '../style/Home.css';
import {Card, Container} from "semantic-ui-react";

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
    },[location.isSearch, location.isLogin, location.keyword])
    return (
        <Container className='container'>

            <h2>{isLogin ? 'Recommended' : 'Latest'} Movies</h2>
            <Card.Group itemsPerRow={5}>
                <Card raised image={src} onClick={() => history.push('/movie/' + '1')}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
                <Card raised image={src}/>
            </Card.Group>
        </Container>
    );
}
Home.propTypes = {};

Home.defaultProps = {};

export default Home;
