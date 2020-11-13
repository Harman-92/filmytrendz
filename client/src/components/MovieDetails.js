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

const checkWishListActive = (wishList) => {
    let a = false
    wishList.forEach(w => {
        if (w.added) {
            a = true
        }
    })
    return a
}

const Cast = (props) => (
    <Card.Group itemsPerRow={4}>
        {props.casts.map((cast, index) => (
                <Card key={index}>
                    <Card.Content className='cast-content'>
                        <Image className='cast-image' floated='left' size='mini' verticalAlign='middle'
                               src={cast.image === '' ? images.no_profile : cast.image}/>
                        <Card.Header className='cast-name'>{cast.name}</Card.Header>
                        <Card.Meta>{cast.role}</Card.Meta>
                    </Card.Content>
                </Card>
            )
        )}
    </Card.Group>
)

const MovieDetails = () => {
    const location = useLocation()
    const history = useHistory()
    const {id} = useParams()
    const [isLogin, setIsLogin] = useState(isAuthenticated)
    const [movieDetails, setMovieDetails] = useState({
        id: 34,
        title: 'Spider Man 3',
        url: '/poster.jpg',
        rating: 4.5,
        description: 'Lorem ipsum dolor sit amet, cu principes  eloquentiam mea,' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'cum. Fugit prompta deleni in sed, singulis explicari vis cu.',
        genre: 'Fiction',
        cast: [
            {image: '/poster.jpg', name: 'Tom Holland', role: 'Peter Parker / Spider-Man'},
            {image: '/poster.jpg', name: 'Samuel L. Jackson', role: 'Nick Fury long long long long long name'},
            {image: '/poster.jpg', name: 'Zendaya', role: 'Harold "Happy" Hogan'},
            {image: '/poster.jpg', name: 'Jon Favreau', role: 'Avebe'},
            {image: '/poster.jpg', name: 'J. B. Smoove', role: 'Julius Dell'},
        ],
        reviews: [
            {
                url: '',
                userId: 23,
                name: 'Matt',
                createdDate: '2020-10-20 15:34',
                title: 'How artistic!',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 4.5
            },
            {
                url: '/empty_profile.png',
                userId: 25,
                name: 'Elliot Fu',
                createdDate: '2020-10-18 15:34',
                title: 'This has been very useful for my research. Thanks as well!',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 4
            },
            {
                url: '/empty_profile.png',
                userId: 21,
                name: 'Jenny Hess',
                createdDate: '2020-10-19 15:34',
                title: 'Elliot you are always so right :)',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 3
            },
            {
                url: '/empty_profile.png',
                userId: 56,
                name: 'Joe Henderson',
                createdDate: '2020-10-20 15:34',
                title: 'Dude, this is awesome. Thanks so much',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 1.5
            },
        ],
        favorite: false,
        watched: false
    })
    const [wishList, setWishList] = useState([{
        id: 2,
        name: 'dark fantasy',
        added: false
    }, {
        id: 5,
        name: 'cyberpunk',
        added: true
    }])
    const [isWishList, setIsWishList] = useState(false)
    const [myReview, setMyReview] = useState({
        title: '',
        description: '',
        rating: 0
    })
    const [user, setUser] = useState(getUserInfo)
    const [similarMovies, setSimilarMovies] = useState([
        {id: 1, url: '/poster.jpg', title: 'Spider Man-1', Genre: 'Fiction', Director: 'Abc'},
        {id: 2, url: '/poster.jpg', title: 'Spider Man-2', Genre: 'Fiction', Director: 'Abc'},
        {id: 3, url: '/poster.jpg', title: 'Spider Man-3', Genre: 'Fiction', Director: 'Abc'},
        {id: 4, url: '/poster.jpg', title: 'Spider Man-4', Genre: 'Fiction', Director: 'Abc'},
        {id: 5, url: '/poster.jpg', title: 'Spider Man-5', Genre: 'Fiction', Director: 'Abc'},
        {id: 6, url: '/poster.jpg', title: 'Spider Man-6', Genre: 'Fiction', Director: 'Abc'},
        {id: 7, url: '/poster.jpg', title: 'Spider Man-7', Genre: 'Fiction', Director: 'Abc'},
    ])
    const [addReview, setAddReview] = useState(false)
    const [searchBy, setSearchBy] = useState('a')
    const [addWishList, setAddWishList] = useState(false)
    const [newWishList, setNewWishList] = useState('')

    const postReview = () => {
        api.post('/movie/' + movieDetails.id + '/review',{
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
                setAddReview(false)
                setMovieDetails({
                    ...movieDetails,
                    reviews: copyReviews
                })
                setMyReview({
                    title: '',
                    description: '',
                    rating: 0
                })
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch((e) => {
            console.log(response.SERVER_ERROR)
        })
    }

    const handleBanReviewer = (id) => {
        api.put('/user/banneduser', {
            id: id
        }).then((res) => {
            if (res.status === 200) {
                alert("banned user successfully")
                history.go(0)
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch((e) => {
            console.log(response.SERVER_ERROR)
        })
    }

    const handleWishListChange = (e, {id, value}) => {
        if(wishList[id].added) {
            api.post('/wishlist/' + value, {
                'remove_list': [movieDetails.id]
            }).then((res) => {
                if (res.status === 200) {
                    let tempArr = [...wishList]
                    tempArr[id] = {...tempArr[id], added: !tempArr[id].added}
                    setWishList(tempArr)
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }else{
            api.post('/wishlist/' + value, {
                'new_list': [movieDetails.id]
            }).then((res) => {
                if (res.status === 200) {
                    let tempArr = [...wishList]
                    tempArr[id] = {...tempArr[id], added: !tempArr[id].added}
                    setWishList(tempArr)
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }
    }
    const handleAddWishList = () => {
        api.put('/wishlist',{
            'name': newWishList
        }).then(res => {
            if (res.status === 200) {

                api.post('/wishlist/'+res.data.id,{
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
                    } else {
                        console.log(response.SERVER_ERROR)
                    }
                }).catch((e) => {
                    console.log(response.SERVER_ERROR)
                })

            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch((e) => {
            console.log(response.SERVER_ERROR)
        })
    }
    const handleFavorite = () => {
        if(movieDetails.favorite){
            api.put('/movie/' + movieDetails.id + '/unfavorite').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        favorite: !movieDetails.favorite
                    })
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }else {
            api.put('/movie/' + movieDetails.id + '/favorite').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        favorite: !movieDetails.favorite
                    })
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }
    }
    const handleWatched = () => {
        if(movieDetails.watched){
            api.delete('/movie/' + movieDetails.id + '/watched').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        watched: !movieDetails.watched
                    })
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }else {
            api.put('/movie/' + movieDetails.id + '/watched').then(res => {
                if (res.status === 200) {
                    setMovieDetails({
                        ...movieDetails,
                        watched: !movieDetails.watched
                    })
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch((e) => {
                console.log(response.SERVER_ERROR)
            })
        }
    }

    useEffect(() => {
        {/*TODO: call recommend movie api*/
        }
        console.log("searchBy: " + searchBy)
    }, [searchBy])

    useEffect(() => {
        setIsWishList(checkWishListActive(wishList))
    }, [wishList])

    useEffect(() => {

        api.get('/movie/' + id).then((res) => {
            if (res.status === 200) {
                const data = res.data
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
                                if(data.wishlist.includes(w.id)){
                                    w.added = true
                                }
                            })
                            setWishList(wishLists)
                        } else {
                            console.log(response.SERVER_ERROR)
                        }
                    }).catch((e) => {
                        console.log(response.SERVER_ERROR)
                    })
                }

            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch((e) => {
            console.log(response.SERVER_ERROR)
        })
    }, [location, isLogin])

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
                        <h1>{movieDetails.title}</h1>
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
                            {/*<p className='movie-rating'> {this.state.movieDetails.averageRating} </p>*/}
                            <Statistic className='movie-rating'>
                                <Statistic.Value>{movieDetails.rating}</Statistic.Value>
                            </Statistic>
                            <ReactStars
                                count={5}
                                value={movieDetails.rating}
                                size={26}
                                isHalf={true}
                                edit={false}
                                activeColor="#7b68ee"
                                color='lightgrey'
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {/*-------------------------movie cast-----------------------------*/}
            <h2 className='movieHeader'>Cast</h2>
            <Divider/>
            {/*<Cast casts={movieDetails.cast}/>*/}
            <span>{movieDetails.actors}</span>

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
                            <Image className='reviewer-image'
                                   circular size='tiny'
                                   src={user.url === '' ? images.no_profile : user.url}
                            />
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
                                               placeholder="Tell us what you think about this movie..."
                                               onChange={(e, {value}) => setMyReview({
                                                   ...myReview,
                                                   description: value
                                               })}
                                />
                                <Segment basic>
                                    <Button floated='right' className='review-button post-button'
                                            type='submit'>Post</Button>
                                    <Button floated='right' className='review-button' onClick={() => {
                                        setAddReview(false)
                                    }}>Cancel</Button>
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

                                    <Image className='reviewer-image' circular size='tiny'
                                           src={review.url === '' ? images.no_profile : review.url}/>
                                    {review.userId === parseInt(user.id) ?
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
                                            <p className='ban-reviewer' onClick={() => handleBanReviewer(review.userId)}>Block
                                                Reviewer</p>
                                        </Popup>
                                    }
                                    <Item.Description>{review.createdDate}</Item.Description>
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

                                    <Image className='reviewer-image' circular size='tiny'
                                           src={review.url === '' ? images.no_profile : review.url}/>
                                    {review.userId === parseInt(user.id) ?
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
                                            <p className='ban-reviewer' onClick={() => handleBanReviewer(review.userId)}>Block
                                                Reviewer</p>
                                        </Popup>
                                    }
                                    <Item.Description>{review.createdDate}</Item.Description>
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


                    <Card.Group itemsPerRow={6}>
                        {similarMovies.map((movie, index) => {
                                if (index < 6) {
                                    return (
                                        <Card key={index} centered={true}
                                              onClick={() => history.push('/movie/' + movie.id)}
                                        >
                                            <Image src={movie.url}/>
                                            <Card.Description textAlign='center'>{movie.title}</Card.Description>
                                        </Card>
                                    )
                                }
                            }
                        )}
                    </Card.Group>
                </Suspense>
            </div>

        </Container>
    );
}

export default MovieDetails
