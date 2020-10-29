import React, {useEffect, useState} from 'react';
import {Card, Container, Form, Image} from "semantic-ui-react";
import '../style/SearchResult.css';
import { useHistory, useLocation } from "react-router-dom";
import {isAuthenticated} from "../config/session";

const SearchResult = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [searchResults, setSearchResults] = useState([
        {id: 1, image: '/poster.jpg', title: 'Spider Man-1', Genre: 'Fiction', Director: 'Abc'},
        {id: 2, image: '/poster.jpg', title: 'Spider Man-2', Genre: 'Fiction', Director: 'Abc'},
        {id: 3, image: '/poster.jpg', title: 'Spider Man-3', Genre: 'Fiction', Director: 'Abc'},
        {id: 4, image: '/poster.jpg', title: 'Spider Man-4', Genre: 'Fiction', Director: 'Abc'},
        {id: 5, image: '/poster.jpg', title: 'Spider Man-5', Genre: 'Fiction', Director: 'Abc'},
        {id: 6, image: '/poster.jpg', title: 'Spider Man-6', Genre: 'Fiction', Director: 'Abc'},
        {id: 7, image: '/poster.jpg', title: 'Spider Man-7', Genre: 'Fiction', Director: 'Abc'},
        {id: 8, image: '/poster.jpg', title: 'Spider Man-4', Genre: 'Fiction', Director: 'Abc'},
        {id: 9, image: '/poster.jpg', title: 'Spider Man-5', Genre: 'Fiction', Director: 'Abc'},
        {id: 10, image: '/poster.jpg', title: 'Spider Man-6', Genre: 'Fiction', Director: 'Abc'},
    ])

    useEffect(() => {
        if (location.isSearch) {
            console.log(location.keyword)
            console.log(location.filter)
            //TODO:API call to search and get search results
        }
    }, [location.isSearch, location.keyword, location.filter])

    // useEffect(() => {
    //     setIsLogin(isAuthenticated())
    //     if (isLogin) {
    //         //TODO: API to get user recommended movies
    //     } else {
    //         //TODO: API to get latest movies
    //     }
    // }, [location, isLogin])

    return (
        <Container className='container'>

            <h1 className='homePageTitle'>Search Results</h1>
            <Form>
                <Form.Group inline>
                    <label>Sorted by: </label>
                    <Form.Radio
                        label='Genre'
                        value='g'
                        // checked={sortedBy === 'g'}
                        // onChange={handleSortedByCheckbox}
                    />
                    <Form.Radio
                        label='Director'
                        value='d'
                        // checked={sortedBy === 'd'}
                        // onChange={handleSortedByCheckbox}
                    />

                </Form.Group>
            </Form>
            <Card.Group itemsPerRow={5}>
                {
                    searchResults.map((movie, index) => (
                        <Card className='movieCard' key={index} onClick={() => history.push('/movie/' + movie.id)}>
                            <Image src={movie.image}/>
                        </Card>
                    ))
                }
            </Card.Group>
        </Container>
    );
}


export default SearchResult;
