import React, {useEffect, useState} from 'react';
import {Button, Card, Container, Dropdown, Form, Header, Icon, Image, Menu, Label, Reveal} from "semantic-ui-react";
import '../style/SearchResult.css';
import { useHistory, useLocation } from "react-router-dom";
import {isAuthenticated} from "../config/session";
import ReactStars from "react-rating-stars-component";



const SearchResult = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [searchResults, setSearchResults] = useState([
        {id: 1, image: '/poster.jpg', title: 'A Spider Man-1', genre: 'Fiction', director: 'Abc', releaseDate:'1991-10-20', averageRating: 4.5},
        {id: 2, image: '/poster.jpg', title: 'B Spider Man-2', genre: 'Fiction', director: 'Abc', releaseDate:'1992-1-21', averageRating: 4.5},
        {id: 3, image: '/poster.jpg', title: 'C Spider Man-3', genre: 'Fiction', director: 'Abc', releaseDate:'1985-9-20', averageRating: 3},
        {id: 4, image: '/poster.jpg', title: 'D Spider Man-4', genre: 'Fiction', director: 'Abc', releaseDate:'2001-10-20', averageRating: 4},
        {id: 5, image: '/poster.jpg', title: 'E Spider Man-5', genre: 'Fiction', director: 'Abc', releaseDate:'1781-10-21', averageRating: 2.5},
        {id: 6, image: '/poster.jpg', title: 'F Spider Man-6', genre: 'Fiction', director: 'Abc', releaseDate:'1991-1-20', averageRating: 4.3},
        {id: 7, image: '/poster.jpg', title: 'G Spider Man-7', genre: 'Fiction', director: 'Abc', releaseDate:'1991-10-20', averageRating: 4.6},
        {id: 8, image: '/poster.jpg', title: 'H Spider Man-8', genre: 'Fiction', director: 'Abc', releaseDate:'2009-10-20', averageRating: 3.6},
        {id: 9, image: '/poster.jpg', title: 'I Spider Man-9', genre: 'Fiction', director: 'Abc', releaseDate:'2012-1-20', averageRating: 2.2},
        {id: 10, image: '/poster.jpg', title: 'J Spider Man-10', genre: 'Fiction', director: 'Abc', releaseDate:'2011-10-20', averageRating: 4.5},
    ])

    const [sortFilter, setSortFilter] = useState({
        keyword:'title',
        ascending:true
    })

    const sortByOptions = [
        {key:0, value: 'title', text:'Title', content:(<Header className='itemFont' subheader='Title'/>)},
        {key:1, value: 'releaseDate', text:'Release Date', content:(<Header className='itemFont' subheader='Release Date'/>)},
        {key:2, value: 'averageRating', text:'Average Rating', content:(<Header className='itemFont' subheader='Average Rating'/>)},
    ]

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

    /*----------------------------------- sort search results --------------------------------------*/
    useEffect(() => {
        console.log("sort keyword: " + sortFilter.keyword, " ascending: " + sortFilter.ascending)
        let copy_SearchResults = [].concat(searchResults);
        let keyword = sortFilter.keyword;
        if (sortFilter.ascending) {
            if (keyword === 'title') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.title > b.title ? 1 : -1)
            } else if (keyword === 'releaseDate') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.releaseDate > b.releaseDate ? 1 : -1)
            } else if (keyword === 'averageRating') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.averageRating > b.averageRating ? 1 : -1)
            }
        } else {
            if (keyword === 'title') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.title > b.title ? -1 : 1)
            } else if (keyword === 'releaseDate') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.releaseDate > b.releaseDate ? -1 : 1)
            } else if (keyword === 'averageRating') {
                copy_SearchResults = copy_SearchResults.sort(
                    (a,b) => a.averageRating > b.averageRating ? -1 : 1)
            }
        }
        setSearchResults(copy_SearchResults)
        // console.log(copy_SearchResults)
    }, [sortFilter.keyword, sortFilter.ascending])

    return (
        <Container className='container'>

            <h1 className='homePageTitle'>Search Results</h1>
            <Menu text>
                <Menu.Menu position='right'>
                    <Menu.Item header>Sort by </Menu.Item>
                    <Menu.Item fitted>
                        <Dropdown
                            search
                            selection
                            placeholder='Title'
                            options={sortByOptions}
                            value={sortFilter.keyword}
                            onChange={(e, {value}) => setSortFilter({
                                ...sortFilter, keyword: value
                            })}
                        />
                    </Menu.Item>
                    <Menu.Item onClick={()=> setSortFilter({...sortFilter, ascending: !sortFilter.ascending})}>
                        {sortFilter.keyword === 'title' ?
                            (sortFilter.ascending ?
                                <Icon name='sort alphabet ascending'/> :
                                <Icon name='sort alphabet descending'/>) :
                            (sortFilter.ascending ?
                                <Icon name='sort numeric ascending' /> :
                                <Icon name='sort numeric descending' />)
                        }
                    </Menu.Item>
                </Menu.Menu>

            </Menu>
            <Card.Group itemsPerRow={5}>
                {
                    searchResults.map((movie, index) => (

                                <Card className='movieCard' fluid
                                      key={index}
                                      onClick={() => history.push('/movie/' + movie.id)}>
                                    <Image  src={movie.image} />
                                    <Card.Content>
                                        <Card.Header>{movie.title}</Card.Header>
                                        <Card.Meta>Released in {movie.releaseDate}</Card.Meta>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <ReactStars
                                            count={5}
                                            value={movie.averageRating}
                                            size={20}
                                            isHalf={true}
                                            edit={false}
                                            activeColor="#7b68ee"
                                            color='lightgrey'
                                        />
                                    </Card.Content>

                                    {/*<Reveal animated='fade' >*/}
                                    {/*    <Reveal.Content visible>*/}
                                    {/*        <Image  src={movie.image} />*/}
                                    {/*    </Reveal.Content>*/}
                                    {/*    <Reveal.Content hidden>*/}
                                    {/*        <Header>{movie.title}</Header>*/}
                                    {/*        <p>Released in {movie.releaseDate}</p>*/}
                                    {/*        <ReactStars*/}
                                    {/*            count={5}*/}
                                    {/*            value={movie.averageRating}*/}
                                    {/*            size={20}*/}
                                    {/*            isHalf={true}*/}
                                    {/*            edit={false}*/}
                                    {/*            activeColor="#7b68ee"*/}
                                    {/*            color='lightgrey'*/}
                                    {/*        />*/}
                                    {/*    </Reveal.Content>*/}
                                    {/*</Reveal>*/}
                                </Card>

                    ))
                }
            </Card.Group>
        </Container>
    );
}


export default SearchResult;
