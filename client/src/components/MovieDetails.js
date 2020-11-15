import React, {Suspense, useState, useEffect} from 'react';
import ReactStars from "react-rating-stars-component";
import '../style/MovieDetails.css';
import {useLocation, useHistory, useParams} from "react-router-dom";
import moment from "moment";
import {
    Button,
    Icon,
    Container,
    Card,
    Image,
    Grid,
    Form,
    Divider,
    Menu,
    Statistic,
    Header,
    Segment,
    Item,
    Popup,
    Radio,
    Input
} from "semantic-ui-react";
import images from "../config/images";
import {getUserInfo, isAuthenticated} from "../config/session";
import api from "../config/axios"
import response from "../config/response";
import StarRatingComponent from 'react-star-rating-component';
import Avatar from "./Avatar";

const checkWishListActive = (wishList) => {
    let a = false
    wishList.forEach(w => {
        if (w.added) {
            a = true
        }
    })
    return a
}

const Actors = (props) => {
    let actors = props.cast
    let arr = actors.split(", ")
    return (
        <Card.Group itemsPerRow={7}>
            {arr.map((cast, index) => {
                if (cast.length > 36) {
                    cast = cast.slice(0, 33) + '...'
                }
                return(
                    <Card key={index} color='violet'>
                        <Card.Content className='cast-content'>
                            <Card.Description className='cast-name'>{cast}</Card.Description>
                        </Card.Content>
                    </Card>
                )}
            )}
        </Card.Group>
    )
}



const MovieDetails = () => {
    const location = useLocation()
    const history = useHistory()
    const {id} = useParams()
    const [isLogin, setIsLogin] = useState(isAuthenticated)
    const [movieDetails, setMovieDetails] = useState({
        reviews: [],
        actors: ''
    })
    const [wishList, setWishList] = useState([])
    const [isWishList, setIsWishList] = useState(false)
    const [myReview, setMyReview] = useState({
        title: '',
        description: '',
        rating: 0
    })
    const [user, setUser] = useState(getUserInfo)
    const [similarMovies, setSimilarMovies] = useState([])
    const [addReview, setAddReview] = useState(false)
    const [searchBy, setSearchBy] = useState('a')
    const [addWishList, setAddWishList] = useState(false)
    const [newWishList, setNewWishList] = useState('')

    const postReview = () => {
        if(myReview.rating === 0){
            alert('Please add the rating.')
        }else {
            let reviewed = false
            movieDetails.reviews.forEach( review =>{
                if(user.id === review.userId){
                    reviewed = true
                    alert("Already reviewed this movie.")
                }
            })
            if(!reviewed) {
                api.post('/movie/' + movieDetails.id + '/review', {
                    'title': myReview.title,
                    'description': myReview.description,
                    'rating': myReview.rating
                }).then(res => {
                    if (res.status === 200) {
                        const copyReviews = Object.assign([], movieDetails.reviews)
                        let time = moment().format('YYYY-MM-DD HH:mm').toString()
                        copyReviews.splice(0, 0, {
                            url: user.url,
                            userId: user.id,
                            name: user.firstName,
                            createdDate: time,
                            title: myReview.title,
                            description: myReview.description,
                            rating: myReview.rating
                        })
                        const newRating = ((movieDetails.rating * movieDetails.reviews.length) + myReview.rating) / (movieDetails.reviews.length + 1)
                        setAddReview(false)
                        setMovieDetails({
                            ...movieDetails,
                            reviews: copyReviews,
                            rating: newRating.toFixed(1)
                        })
                        setMyReview({
                            title: '',
                            description: '',
                            rating: 0
                        })
                    } else if (res.status === 401) {
                        history.push('/')
                    } else {
                        console.log(response.SERVER_ERROR)
                    }
                }).catch(() => {
                    console.log(response.SERVER_UNAVAILABLE)
                })
            }
        }
    }

    const handleBanReviewer = (id) => {
            api.put('/user/banneduser', {
                id: id
            }).then((res) => {
                if (res.status === 200) {
                    alert("Ban user successfully")
                    history.go(0)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
    }

    const handleWishListChange = (e, {id, value}) => {
        if (wishList[id].added) {
            api.post('/wishlist/' + value, {
                'remove_list': [movieDetails.id]
            }).then((res) => {
                if (res.status === 200) {
                    let tempArr = [...wishList]
                    tempArr[id] = {...tempArr[id], added: !tempArr[id].added}
                    setWishList(tempArr)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else {
            api.post('/wishlist/' + value, {
                'new_list': [movieDetails.id]
            }).then((res) => {
                if (res.status === 200) {
                    let tempArr = [...wishList]
                    tempArr[id] = {...tempArr[id], added: !tempArr[id].added}
                    setWishList(tempArr)
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
    const handleAddWishList = () => {
        api.put('/wishlist', {
            'name': newWishList
        }).then(res => {
            if (res.status === 200) {

                api.post('/wishlist/' + res.data.id, {
                    'new_list': [movieDetails.id]
                }).then(res => {
                    if (res.status === 200) {
                        let tempArr = [...wishList]
                        tempArr.push({
                            id: 43,
                            name: newWishList,
                            added: true
                        })
                        setWishList(tempArr)
                        setNewWishList('')
                        setAddWishList(false)
                    } else if(res.status === 401){
                        history.push('/')
                    } else {
                        console.log(response.SERVER_ERROR)
                    }
                }).catch(() => {
                    console.log(response.SERVER_UNAVAILABLE)
                })

            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }
    const handleFavorite = () => {
        if (movieDetails.favorite) {
            api.put('/movie/' + movieDetails.id + '/unfavorite').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        favorite: !movieDetails.favorite
                    })
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else {
            api.put('/movie/' + movieDetails.id + '/favorite').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        favorite: !movieDetails.favorite
                    })
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
    const handleWatched = () => {
        if (movieDetails.watched) {
            api.delete('/movie/' + movieDetails.id + '/watched').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        watched: !movieDetails.watched
                    })
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else {
            api.put('/movie/' + movieDetails.id + '/watched').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        watched: !movieDetails.watched
                    })
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

    useEffect(() => {

        api.get('/movie/' + id).then((res) => {
            if (res.status === 200) {
                const data = res.data
                if(data.reviews.length > 0) {
                    let rating = 0
                    data.reviews.forEach(review => {
                        rating += review.rating
                    })
                    data.movie.rating = (rating / data.reviews.length).toFixed(1)
                }
                setMovieDetails({
                    ...data.movie,
                    favorite: data.favorite,
                    cast: [],
                    watched: data.watched,
                    reviews: data.reviews
                })
                if (isAuthenticated()) {
                    setIsLogin(isAuthenticated())
                    setUser(getUserInfo)
                    api.get('/wishlist').then((res) => {
                        if (res.status === 200) {
                            let wishLists = res.data.wishlists
                            wishLists.forEach(w => {
                                if (data.wishlist.includes(w.id)) {
                                    w.added = true
                                }
                            })
                            setWishList(wishLists)
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
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }, [location, isLogin, id])

    useEffect(() => {
        setIsWishList(checkWishListActive(wishList))
    }, [wishList])

    useEffect(() => {
        if(movieDetails.id) {
            let filterString = ""
            if (searchBy === "g") {
                filterString += "genre=true"
            } else if (searchBy === "d") {
                filterString += "director=true"
            }
            api.get('/recommend/' + movieDetails.id + '?' + filterString).then((res) => {
                if (res.status === 200) {
                    setSimilarMovies(res.data.movies)
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_ERROR)
            })
        }
    }, [searchBy, movieDetails.id])

    return (
        <Container>
            {/*-------------------------movie intro-----------------------------*/}

            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Image src={movieDetails.url === '' ? images.no_image : movieDetails.url}
                               size='small'
                               rounded
                               alt={movieDetails.title}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <h1>{movieDetails.title}
                            <span style={{color: 'white'}}>-</span>
                            <span style={{fontSize: 20, color: 'grey'}}> {movieDetails.year} </span>
                            <div>
                            <span style={{fontSize: 14, fontWeight: 'normal', color: 'darkgrey'}}> Directed by </span>
                            <span style={{fontSize: 14, color: 'grey'}}> {movieDetails.director}</span>
                            </div>
                        </h1>
                        <p>{movieDetails.description}</p>
                        <h3>Genre</h3>
                        <span>{movieDetails.genre}</span>

                    </Grid.Column>
                    <Grid.Column width={3} className='movie-details-right'>

                        {/*-------------------------Movie Menu Options----------------------------*/}

                        {isLogin ?

                            <Menu className='movie-menu' icon fluid text size='massive'>

                                <Popup
                                    trigger={
                                        <Menu.Item
                                            name='fav'
                                            active={movieDetails.favorite}
                                            onClick={handleFavorite}
                                        >
                                            {movieDetails.favorite ?
                                                <Icon name='heart' color='violet'/>
                                                :
                                                <Icon name='heart outline' inverted color='violet'/>
                                            }
                                        </Menu.Item>
                                    }
                                    content='Favorite movie'
                                    position='top center'
                                />

                                {/*-----------------------Wish List popup----------------------*/}
                                <Popup
                                    trigger={
                                        <Menu.Item
                                            name='wish'
                                        ><Popup
                                            position='bottom right'
                                            trigger={isWishList ? <Icon name='star' color='violet'/> :
                                                <Icon name='star outline' inverted color='violet'/>}
                                            on='click'
                                            className='wishlist-popup'
                                            onClose={() => setAddWishList(false)}
                                            flowing={false}
                                            hideOnScroll
                                        >
                                            <Segment basic className='wishlist-container'>
                                                {(wishList && wishList.length > 0) ?
                                                    <Form>
                                                        {wishList.map((w, index) => (
                                                            <Form.Field key={index}>
                                                                <Radio
                                                                    id={index}
                                                                    label={w.name}
                                                                    value={w.id}
                                                                    checked={w.added}
                                                                    onClick={handleWishListChange}
                                                                />
                                                            </Form.Field>
                                                        ))}
                                                        <Divider fitted/>
                                                    </Form>
                                                    : null}
                                                {addWishList ?
                                                    <Input icon placeholder='Enter...' className='wishlist-input'
                                                           onChange={(e, {value}) => setNewWishList(value)}
                                                    >
                                                        <input onKeyPress={event => {
                                                            if (event.key === 'Enter') {
                                                                handleAddWishList()
                                                            }
                                                        }}/>
                                                        <Icon name='terminal'/>
                                                    </Input>
                                                    :
                                                    <Button basic icon labelPosition='right' color='black'
                                                            className='wishlist-add'
                                                            onClick={() => setAddWishList(true)}
                                                    >
                                                        Add Wish List
                                                        <Icon className='wishlist-add-icon' name='plus'/>
                                                    </Button>
                                                }
                                            </Segment>
                                        </Popup>
                                        </Menu.Item>
                                    }
                                    content='Wishlist'
                                    position='top center'
                                />

                                {/*--------------------watched menu option------------------------*/}
                                <Popup
                                    trigger={
                                        <Menu.Item
                                            name='watched'
                                            active={movieDetails.watched}
                                            onClick={handleWatched}
                                        >
                                            {movieDetails.watched ?
                                                <Icon name='check circle' color='violet'/>
                                                :
                                                <Icon name='check circle outline' inverted color='violet'/>
                                            }
                                        </Menu.Item>
                                    }
                                    content='Watched movie'
                                    position='top center'
                                />

                                {/*------------------------share link popup-----------------------*/}
                                <Popup
                                    trigger={
                                        <Menu.Item
                                            name='share'
                                            active={true}
                                        >
                                            <Popup
                                                position='bottom right'
                                                trigger={<Icon name='share alternate' color='blue'/>}
                                                on='click'
                                                className='share-popup'
                                                flowing={false}
                                                hideOnScroll
                                            >
                                                <Segment basic className='share-link'>

                                                    {window.location.href}
                                                    <Button
                                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                                        className='wishlist-add share-link-button' basic
                                                        icon='paperclip'
                                                    />
                                                </Segment>
                                            </Popup>
                                        </Menu.Item>
                                    }
                                    content='Share'
                                    position='top center'
                                />

                            </Menu>
                            :
                            <Menu className='movie-menu' icon fluid text size='massive'/>
                        }


                        {/*--------------------------Movie Rating--------------------------*/}

                        <div className='movie-rating-wrapper'>
                            <Statistic className='movie-rating'>
                                <Statistic.Value>{movieDetails.rating}</Statistic.Value>
                            </Statistic>

                            <div style={{fontSize: 26, display: 'flex', justifyContent: 'flex-end'}}>
                                <StarRatingComponent
                                    name="rate2"
                                    editing={false}
                                    starCount={5}
                                    starColor="#7b68ee"
                                    emptyStarColor="lightgrey"
                                    value={parseFloat(movieDetails.rating)}
                                />
                            </div>

                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {/*-------------------------movie cast-----------------------------*/}
            <h2 className='movieHeader'>Cast</h2>
            <Divider/>
            <Actors cast={movieDetails.actors}/>

            {/*-------------------------movie review-----------------------------*/}
            <div className="movieHeader">
                <Segment clearing basic className='review-header'>
                    <Header as='h2' floated='left'>
                        Reviews
                    </Header>
                    {isLogin ?
                        <Button floated='right' basic color='violet' icon='add' content='Add Review'
                                labelPosition='left'
                                onClick={() => {
                                    setAddReview(true)
                                }}
                        /> : null}
                </Segment>
                <Divider fitted/>

            </div>
            {/*---------------------Add new review-----------------------------*/}
            {addReview ?
                <Grid columns={2} className='review-grid'>
                    <Grid.Row>
                        <Grid.Column width={3} textAlign={"center"} className='reviewer'>
                            <div className='reviewer-image'>
                                <Avatar  user={user.firstName} size='tiny'/>
                            </div>
                            <h4 className='reviewer-name-user'>{user.firstName}</h4>
                            <Item.Description>{moment().format('YYYY-MM-DD HH:mm').toString()}</Item.Description>
                        </Grid.Column>
                        <Grid.Column width={10} className='review-content'>
                            <Form onSubmit={postReview}>
                                <Form.Input placeholder='Title'
                                            onChange={(e, {value}) => setMyReview({
                                                ...myReview,
                                                title: value
                                            })}
                                />
                                <ReactStars
                                    count={5}
                                    onChange={(newRating) => setMyReview({
                                        ...myReview,
                                        rating: newRating
                                    })}
                                    size={18}
                                    isHalf={true}
                                    activeColor="#7b68ee"
                                    color='lightgrey'
                                />
                                <Form.TextArea style={{minHeight: 150}}
                                               placeholder="Write your review (optional)"
                                               onChange={(e, {value}) => setMyReview({
                                                   ...myReview,
                                                   description: value
                                               })}
                                />
                                <Segment basic>
                                    <Button floated='right' className='review-button post-button'
                                            type='submit'>Post</Button>
                                    <Button floated='right' className='review-button'
                                            onClick={() => setAddReview(false)}>Cancel</Button>
                                </Segment>
                            </Form>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
                : null
            }

            {/*-------------------------Loading reviews--------------------------------*/}

            {movieDetails.reviews.map((review, index) => (
                <div key={index}>{
                    (addReview ? index % 2 !== 0 : index % 2 === 0) ?
                        <Grid columns={2} className='review-grid'>
                            <Grid.Row>
                                <Grid.Column width={3} textAlign='center' className='reviewer'>

                                    <div className='reviewer-image'>
                                        <Avatar  user={review.name} size='tiny'/>
                                    </div>
                                    {review.userId === parseInt(user.id) || !isLogin ?
                                        <h4 className='reviewer-name-user'>{review.name}</h4>
                                        :
                                        <Popup wide
                                               position='right center'
                                               trigger={
                                                   <h4 className='reviewer-name'>{review.name}</h4>
                                               }
                                               on='click'
                                               hideOnScroll
                                        >
                                            <p className='ban-reviewer'
                                               onClick={() => handleBanReviewer(review.userId)}>Block
                                                Reviewer</p>
                                        </Popup>
                                    }
                                    <Item.Description>{review.createdDate.replace(/T/, ' ')}</Item.Description>
                                </Grid.Column>
                                <Grid.Column width={10} className='review-content'>
                                    <Header as='a'>{review.title}</Header>
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={18}
                                        isHalf={true}
                                        edit={false}
                                        activeColor='#7b68ee'
                                        color='lightgrey'
                                    />
                                    <Item.Description className='review-text'>{review.description}</Item.Description>
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>
                        :
                        <Grid columns={2} className='review-grid'>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                </Grid.Column>
                                <Grid.Column width={10} textAlign={"right"} className='review-content review-right'>
                                    <Header as='a'>{review.title}</Header>
                                    <div>
                                        <ReactStars
                                            count={5}
                                            value={review.rating}
                                            size={18}
                                            isHalf={true}
                                            edit={false}
                                            activeColor="#7b68ee"
                                            color='lightgrey'
                                        /></div>
                                    <Item.Description
                                        className='review-text right'>{review.description}</Item.Description>
                                </Grid.Column>

                                <Grid.Column width={3} textAlign={"center"} className='reviewer'>

                                    <div className='reviewer-image'>
                                        <Avatar  user={review.name} size='tiny'/>
                                    </div>
                                    {review.userId === parseInt(user.id) || !isLogin ?
                                        <h4 className='reviewer-name-user'>{review.name}</h4>
                                        :
                                        <Popup wide
                                               position='left center'
                                               trigger={
                                                   <h4 id={review.userId} className='reviewer-name'>{review.name}</h4>
                                               }
                                               on='click'
                                               hideOnScroll
                                        >
                                            <p className='ban-reviewer'
                                               onClick={() => handleBanReviewer(review.userId)}>Block
                                                Reviewer</p>
                                        </Popup>
                                    }
                                    <Item.Description>{review.createdDate.replace(/T/, ' ')}</Item.Description>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>}
                </div>
            ))}

            {/*-------------------------similar movies-----------------------------*/}
            <div className="movieHeader">
                <h2>Similar Movies</h2>
                <Divider/>
                <Suspense fallback={<div>Loading...</div>}>
                    <Form>
                        <Form.Group inline>
                            <label>By: </label>
                            <Form.Radio
                                label='All'
                                value='a'
                                checked={searchBy === 'a'}
                                onChange={() => setSearchBy('a')}
                            />
                            <Form.Radio
                                label='Genre'
                                value='g'
                                checked={searchBy === 'g'}
                                onChange={() => setSearchBy('g')}
                            />
                            <Form.Radio
                                label='Director'
                                value='d'
                                checked={searchBy === 'd'}
                                onChange={() => setSearchBy('d')}
                            />
                        </Form.Group>
                    </Form>


                    <Card.Group itemsPerRow={5}>

                        {similarMovies.map((movie, index) => (
                            index < 5 ?
                                <Card className='movieCard' key={index}>
                                    <Image src={movie.url=== '' ? images.no_image : movie.url}/>
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
                                : null)
                        )}
                    </Card.Group>
                </Suspense>
            </div>

        </Container>
    );
}

export default MovieDetails
