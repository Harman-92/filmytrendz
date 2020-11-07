import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Container, Divider,
    Dropdown,
    Header,
    Icon,
    Image, Label,
    Menu,
    Modal
} from "semantic-ui-react";
import '../style/ResultPage.css';
import {useHistory, useLocation} from "react-router-dom";
import {isAuthenticated} from "../config/session";

const ResultPage = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(isAuthenticated())
    const [movieResults, setMovieResults] = useState([
        {
            id: 1,
            image: '/poster.jpg',
            title: 'A Spider Man-1',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.5
        },
        {
            id: 2,
            image: '/poster.jpg',
            title: 'B Spider Man-2',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1992',
            averageRating: 4.5
        },
        {
            id: 3,
            image: '/poster.jpg',
            title: 'C Spider Man-3',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1985',
            averageRating: 3
        },
        {
            id: 4,
            image: '/poster.jpg',
            title: 'D Spider Man-4',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '2001',
            averageRating: 4
        },
        {
            id: 5,
            image: '/poster.jpg',
            title: 'E Spider Man-5',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1781',
            averageRating: 2.5
        },
        {
            id: 6,
            image: '/poster.jpg',
            title: 'F Spider Man-6',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.3
        },
        {
            id: 7,
            image: '/poster.jpg',
            title: 'G Spider Man-7',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '1991',
            averageRating: 4.6
        },
        {
            id: 8,
            image: '/poster.jpg',
            title: 'H Spider Man-8',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '2009',
            averageRating: 3.6
        },
        {
            id: 9,
            image: '/poster.jpg',
            title: 'I Spider Man-9',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '2012',
            averageRating: 2.2
        },
        {
            id: 10,
            image: '/poster.jpg',
            title: 'J Spider Man-10',
            genre: 'Fiction',
            director: 'Abc',
            releaseYear: '2011',
            averageRating: 4.5
        },
    ])

    const [sortFilter, setSortFilter] = useState({
        keyword: 'title',
        ascending: true
    })

    const sortByOptions = [
        {key: 0, value: 'title', text: 'Title', content: (<Header className='itemFont' subheader='Title'/>)},
        {
            key: 1,
            value: 'releaseYear',
            text: 'Release Year',
            content: (<Header className='itemFont' subheader='Release Year'/>)
        },
        {
            key: 2,
            value: 'averageRating',
            text: 'Average Rating',
            content: (<Header className='itemFont' subheader='Average Rating'/>)
        },
    ]

    const [modalOpen, setModalOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState({index: -1, title: ''})

    const pageType = history.location.pathname.slice(1)

    useEffect(() => {
        setIsLogin(isAuthenticated())
        if (location.isSearch) {
            console.log("location: " + location.keyword)
            console.log(location.filter)
            //TODO:API call to search and get search results
        } else {
            if (isLogin) {
                if (pageType === 'favorite') {
                    //TODO:API call to favorite and get results
                } else if (pageType === 'watched') {
                    //TODO:API call to watched list and get results
                } else if (pageType === 'reviewed') {
                    //TODO:API call to reviewed list and get results
                }
            } else {
                history.push('/')
            }
        }

    }, [location.isSearch, location.keyword, location.filter, location, isLogin])


    /*----------------------------------- sort search results --------------------------------------*/
    useEffect(() => {
        console.log("sort keyword: " + sortFilter.keyword, " ascending: " + sortFilter.ascending)
        let copy_movieResults = [].concat(movieResults);
        let keyword = sortFilter.keyword;
        if (sortFilter.ascending) {
            if (keyword === 'title') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.title > b.title ? 1 : -1)
            } else if (keyword === 'releaseYear') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.releaseYear > b.releaseYear ? 1 : -1)
            } else if (keyword === 'averageRating') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.averageRating > b.averageRating ? 1 : -1)
            }
        } else {
            if (keyword === 'title') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.title > b.title ? -1 : 1)
            } else if (keyword === 'releaseYear') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.releaseYear > b.releaseYear ? -1 : 1)
            } else if (keyword === 'averageRating') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.averageRating > b.averageRating ? -1 : 1)
            }
        }
        console.log(copy_movieResults)
        setMovieResults(copy_movieResults)
    }, [sortFilter.keyword, sortFilter.ascending])

    const deteleCard = () => {
        console.log(deleteItem.index)
        setModalOpen(false)
        const copy_resultList = [].concat(movieResults)
        copy_resultList.splice(deleteItem.index, 1)
        setMovieResults(copy_resultList)
    }

    return (
        <Container className='container'>
            {console.log('pageType: ' + pageType)}
            {pageType === 'search' ?
                <h1 className='homePageTitle'>Search Results</h1> :
                pageType === 'favorite' ?
                    <h1 className='homePageTitle'>Favorite Movies</h1> :
                    pageType === 'watched' ?
                        <h1 className='homePageTitle'>Watched Movies</h1> :
                        <h1 className='homePageTitle'>Reviewed Movies</h1>
            }

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
                    <Menu.Item onClick={() => setSortFilter({...sortFilter, ascending: !sortFilter.ascending})}>
                        {sortFilter.keyword === 'title' ?
                            (sortFilter.ascending ?
                                <Icon name='sort alphabet ascending'/> :
                                <Icon name='sort alphabet descending'/>) :
                            (sortFilter.ascending ?
                                <Icon name='sort numeric ascending'/> :
                                <Icon name='sort numeric descending'/>)
                        }
                    </Menu.Item>
                </Menu.Menu>

            </Menu>
            <Card.Group itemsPerRow={5}>
                {
                    movieResults.map((movie, index) => (
                        <Card className='movieCard' fluid
                              key={index}
                        >
                            <Image src={movie.image}/>
                            <Card.Content as={'div'} className='movie-card-content'>
                                {
                                    pageType !== 'search'  && pageType !== 'reviewed'?
                                        <Label as='a' corner='right' color='violet' icon='x'
                                             onClick={() => {
                                                    setModalOpen(true)
                                                    setDeleteItem({
                                                        index: index,
                                                        title: movie.title
                                                    })
                                                }} />: null
                                }
                                <div className='cardContentView'
                                    onClick={() => history.push('/movie/' + movie.id)}>
                                    <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                    <Divider className='cardDivider'/>
                                    <Card.Meta className='cardContext'>Released in {movie.releaseYear}</Card.Meta>
                                    <div>
                                        <Icon name='star' inverted color='violet'/> {movie.averageRating}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    ))
                }
            </Card.Group>

            <Modal
                size='tiny'
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onOpen={() => setModalOpen(true)}
            >
                <Modal.Content>
                    <h4>
                        Are you sure to remove
                        <span className='spanStyle'>  "{deleteItem.title}"  </span>
                        from <span
                        className='spanStyle'>  {pageType.replace(/^\S/, s => s.toUpperCase())}  </span> list?
                    </h4>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setModalOpen(false)}>
                        <Icon name='cancel'/> CANCEL
                    </Button>
                    <Button color='red' onClick={deteleCard}>
                        <Icon name='trash alternate outline'/> REMOVE
                    </Button>
                </Modal.Actions>
            </Modal>

        </Container>
    );
}


export default ResultPage;
