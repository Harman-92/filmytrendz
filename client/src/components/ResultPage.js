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
import api from "../config/axios";
import response from "../config/response";
import images from "../config/images";

const ResultPage = () => {
    const history = useHistory()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(isAuthenticated())
    const [movieResults, setMovieResults] = useState([])

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
    const [deleteItem, setDeleteItem] = useState({index: -1, id: 0, title: ''})

    const pageType = history.location.pathname.slice(1)

    useEffect(() => {
        setIsLogin(isAuthenticated())
        if (location.isSearch) {
            let filterString = "search="+location.keyword
            const filter = location.filter
            if(filter.description){
                filterString += "&description="+filter.description
            }
            if(filter.yearFrom && filter.yearTo){
                filterString += "&year_start="+filter.yearFrom+"&year_end="+filter.yearTo
            }
            if(filter.ratingFrom && filter.ratingTo){
                filterString += "&rating_start="+filter.ratingFrom+"&rating_end="+filter.ratingTo
            }
            if(filter.cast){
                filterString += "&cast="+filter.cast
            }
            if(filter.genres.length > 0){
                filterString += "&genre="+filter.genres
            }
            api.get('/movie?'+filterString).then((res) => {
                if (res.status === 200) {
                    setMovieResults(res.data.movies)
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else {
            if (isLogin) {
                if (pageType === 'favorite') {
                    api.get('/movie?favorite=true').then((res) => {
                        if (res.status === 200) {
                            setMovieResults(res.data.movies)
                        } else if(res.status === 401){
                            history.push('/')
                        } else {
                            console.log(response.SERVER_ERROR)
                        }
                    }).catch(() => {
                        console.log(response.SERVER_UNAVAILABLE)
                    })
                } else if (pageType === 'watched') {
                    api.get('/movie?watched=true').then((res) => {
                        if (res.status === 200) {
                            setMovieResults(res.data.movies)
                        } else if(res.status === 401){
                            history.push('/')
                        } else {
                            console.log(response.SERVER_ERROR)
                        }
                    }).catch(() => {
                        console.log(response.SERVER_UNAVAILABLE)
                    })
                } else if (pageType === 'reviewed') {
                    api.get('/movie?reviewed=true').then((res) => {
                        if (res.status === 200) {
                            setMovieResults(res.data.movies)
                        } else if(res.status === 401){
                            history.push('/')
                        } else {
                            console.log(response.SERVER_ERROR)
                        }
                    }).catch(() => {
                        console.log(response.SERVER_UNAVAILABLE)
                    })
                }
            } else {
                history.push('/')
            }
        }

    }, [location.isSearch, location.keyword, location.filter, location, isLogin, history])


    /*----------------------------------- sort search results --------------------------------------*/
    useEffect(() => {
        let copy_movieResults = [].concat(movieResults);
        let keyword = sortFilter.keyword;
        if (sortFilter.ascending) {
            if (keyword === 'title') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.title > b.title ? 1 : -1)
            } else if (keyword === 'releaseYear') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.year > b.year ? 1 : -1)
            } else if (keyword === 'averageRating') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.rating > b.rating ? 1 : -1)
            }
        } else {
            if (keyword === 'title') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.title > b.title ? -1 : 1)
            } else if (keyword === 'releaseYear') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.year > b.year ? -1 : 1)
            } else if (keyword === 'averageRating') {
                copy_movieResults = copy_movieResults.sort(
                    (a, b) => a.rating > b.rating ? -1 : 1)
            }
        }
        setMovieResults(copy_movieResults)
    }, [sortFilter.keyword, sortFilter.ascending])

    const deteleCard = () => {
        if (pageType === 'favorite') {
            api.put('/movie/' + deleteItem.id + '/unfavorite').then(res => {
                if (res.status === 200) {
                    setModalOpen(false)
                    const copy_resultList = [].concat(movieResults)
                    copy_resultList.splice(deleteItem.index, 1)
                    setMovieResults(copy_resultList)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else if (pageType === 'watched') {
            api.delete('/movie/' + deleteItem.id + '/watched').then(res => {
                if (res.status === 200) {
                    setModalOpen(false)
                    const copy_resultList = [].concat(movieResults)
                    copy_resultList.splice(deleteItem.index, 1)
                    setMovieResults(copy_resultList)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        }
    }

    return (
        <Container className='container'>
            {pageType === 'search' ?
                <h1 className='homePageTitle'>Search Results</h1> :
                pageType === 'favorite' ?
                    <h1 className='homePageTitle'>Favorite Movies</h1> :
                    pageType === 'watched' ?
                        <h1 className='homePageTitle'>Watched Movies</h1> :
                        <h1 className='homePageTitle'>Reviewed Movies</h1>
            }

            {/*--------------------------------- srot by -----------------------------*/}
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

            {/*------------------------------------- movie cards --------------------------------*/}
            {
                movieResults.length === 0 ?

                        pageType === 'search' ?
                            <div style={{display: 'flex', flexDirection: 'column',alignItems:'center'}}>
                                <Image size='medium' src={images.no_result}/>
                                <div className='recommendText'>
                                    <p>Opps! There were no matches for your search term. </p>
                                    <p>Please try to use other key words.</p>
                                </div>
                            </div> :
                            <div style={{display: 'flex', flexDirection: 'column',alignItems:'center'}}>
                                <Image size='medium' src={images.no_result}/>
                                <div className='recommendText'>
                                    <p>Opps! You don't have any movies in your {pageType.replace(/^\S/, s => s.toUpperCase())} list. </p>
                                    <p>Enjoy your film travel and share your life in film.</p>
                                </div>
                            </div>
                    :
                    <Card.Group itemsPerRow={5}>
                        {
                            movieResults.map((movie, index) => (
                                index<20?
                                <Card className='movieCard' fluid
                                      key={index}
                                >
                                    <Image src={movie.url === '' ? images.no_image : movie.url}/>
                                    <Card.Content as={'div'} className='movie-card-content'>
                                        {
                                            pageType !== 'search' && pageType !== 'reviewed' ?
                                                <Label as='a' corner='right' color='violet' icon='x'
                                                       onClick={() => {
                                                           setModalOpen(true)
                                                           setDeleteItem({
                                                               index: index,
                                                               id: movie.id,
                                                               title: movie.title
                                                           })
                                                       }}/>
                                                : null
                                        }
                                        <div className='cardContentView'
                                             onClick={() => history.push('/movie/' + movie.id)}>
                                            <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                            <Divider className='cardDivider'/>
                                            <Card.Meta className='cardContext'>Released in {movie.year}</Card.Meta>
                                            <div>
                                                <Icon name='star' inverted color='violet'/> {movie.rating}
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>:null
                            ))
                        }
                    </Card.Group>
            }




            {/*----------------------------- delete movie from list ---------------------------*/}
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
