import React, {Component, Suspense, useState} from 'react';
import ReactStars from "react-rating-stars-component";
import '../style/MovieDetails.css';

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
    Comment, Menu, Statistic, Header, Segment, Item, Input, ItemContent
} from "semantic-ui-react";
import SimilarMovies from "./SimilarMovies";

const Review = (props) => (
    <div>
        <Comment.Group>
            {props.reviews.map((review, index) => (
                    <Comment key={index}>
                        <Comment.Avatar as='a' src={review.avatar}/>
                        <Comment.Content>
                            <Grid className='gridColumnMargin'>
                                <Grid.Column width={5}>
                                    <h4>{review.user}</h4>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <ReactStars
                                        count={5}
                                        value={review.rate}
                                        size={18}
                                        isHalf={true}
                                        edit={false}
                                        activeColor="#7b68ee"
                                        color='lightgrey'
                                    />
                                </Grid.Column>
                                <Grid.Column width={7}>
                                    <p className='dateTime'>Created at {review.createdTime}</p>
                                </Grid.Column>
                            </Grid>

                            <Comment.Text><p>{review.comment}</p></Comment.Text>
                        </Comment.Content>
                    </Comment>
                )
            )}
        </Comment.Group>
    </div>
)

const Cast = (props) => (
    <Card.Group itemsPerRow={4}>
        {props.casts.map((cast, index) => (
                <Card key={index}>
                    <Card.Content className='cast-content'>
                        <Image fluid className='cast-image' floated='left' size='mini' verticalAlign='middle' src={cast.image}/>
                        <Card.Header className='cast-name'>{cast.name}</Card.Header>
                        <Card.Meta>{cast.role}</Card.Meta>
                    </Card.Content>
                </Card>
            )
        )}
    </Card.Group>
)


const MovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState({
        title: 'Spider Man 3',
        image: '/poster.jpg',
        averageRating: 4.5,
        description: 'Lorem ipsum dolor sit amet, cu principes  eloquentiam mea,' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
            'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
            'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
            'cum. Fugit prompta deleni in sed, singulis explicari vis cu.',
        genre: ['Fiction', 'Horror'],
        cast: [
            {image: '/poster.jpg', name: 'Tom Holland', role: 'Peter Parker / Spider-Man'},
            {image: '/poster.jpg', name: 'Samuel L. Jackson', role: 'Nick Fury long long long long long name'},
            {image: '/poster.jpg', name: 'Zendaya', role: 'Harold "Happy" Hogan'},
            {image: '/poster.jpg', name: 'Jon Favreau', role: 'Avebe'},
            {image: '/poster.jpg', name: 'J. B. Smoove', role: 'Julius Dell'},
        ],
        reviews: [
            {
                avatar: '/empty_profile.png',
                id: 23,
                name: 'Matt',
                createdTime: '2020-10-20 15:34',
                title: 'How artistic!',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 4.5
            },
            {
                avatar: '/empty_profile.png',
                id: 25,
                name: 'Elliot Fu',
                createdTime: '2020-10-18 15:34',
                title: 'This has been very useful for my research. Thanks as well!',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 4
            },
            {
                avatar: '/empty_profile.png',
                id: 21,
                name: 'Jenny Hess',
                createdTime: '2020-10-19 15:34',
                title: 'Elliot you are always so right :)',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 3
            },
            {
                avatar: '/empty_profile.png',
                id: 56,
                name: 'Joe Henderson',
                createdTime: '2020-10-20 15:34',
                title: 'Dude, this is awesome. Thanks so much',
                description: 'at dolorem consectetuer.  Pri oporteat consulatu intellegamte etetur voluptatum',
                rating: 1.5
            },
        ],
        favorite: false,
        wishLists: [{
            id: 2,
            name: 'dark fantasy'
        }, {
            id: 5,
            name: 'cyberpunk'
        }],
        watched: false,
    })
    const [myReview, setMyReview] = useState({
        title: '',
        description:'',
        rating: 0
    })
    const [user, setUser] = useState({
        id: '34',
        name: 'Natalie',
        avatar: '/avatar.jpeg',
    })
    const [similarMovies, setSimilarMovies] = useState([
        {image: '/poster.jpg', title: 'Spider Man-1', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-2', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-3', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-4', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-5', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-6', Genre: 'Fiction', Director: 'Abc'},
        {image: '/poster.jpg', title: 'Spider Man-7', Genre: 'Fiction', Director: 'Abc'},
    ])
    const [addReview, setAddReview] = useState(false)
    const [sortedBy, setSortedBy] = useState('g')

    const postReview = () => {
        const copyReviews = Object.assign([], movieDetails.reviews)
        let time = moment().format('YYYY-MM-DD HH:mm').toString()
        copyReviews.splice(0, 0, {
            avatar: user.avatar,
            id:user.id,
            name: user.name,
            createdTime: time,
            title: myReview.title,
            description: myReview.description,
            rating: myReview.rating
        })

        // TODO:call add review api
        console.log(copyReviews)
        setAddReview(false)
        setMovieDetails({
            ...movieDetails,
            reviews: copyReviews
        })
        // this.setState({movieDetails: {...movieDetails, reviews: copyReviews}})
        // this.setState({addReview: false})
    }

    const handleSortedByCheckbox = (e, {value}) => {
        console.log("sorted by ", value)
        setSortedBy(value)
        //TODO:sort the similarmovies
    }

    const handleShare = () => {
        alert("share a link")
        //TODO: create a link
    }

    const handleClickReviewer = (e) => {
        console.log(e.target.id)
    }

    return (
        <Container>
            {/*-------------------------movie intro-----------------------------*/}

            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Image src={movieDetails.image} size='small' rounded
                               alt={movieDetails.title}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <h1>{movieDetails.title}</h1>
                        <p>{movieDetails.description}</p>
                        <h3>Genre</h3>
                        <p>{movieDetails.genre}</p>
                    </Grid.Column>
                    <Grid.Column width={3} className='movie-details-right'>
                        <Menu className='movie-menu' icon fluid text size='massive'>
                            <Menu.Item
                                name='fav'
                                active={movieDetails.favorite}
                                onClick={() => setMovieDetails({...movieDetails, favorite: !movieDetails.favorite})}>
                                <Icon name='like'/>
                            </Menu.Item>
                            <Menu.Item
                                name='wish'
                                active
                            >
                                <Icon name='star'/>
                            </Menu.Item>
                            <Menu.Item
                                name='watched'
                                active={movieDetails.watched}
                            >
                                <Icon name='check square'/>
                            </Menu.Item>
                            <Menu.Item
                                name='share'
                                active={true}
                                onClick={handleShare}
                            >
                                <Icon name='share alternate' color='blue'/>
                            </Menu.Item>
                        </Menu>

                        <div className='movie-rating-wrapper'>
                            {/*<p className='movie-rating'> {this.state.movieDetails.averageRating} </p>*/}
                            <Statistic className='movie-rating'>
                                <Statistic.Value>{movieDetails.averageRating}</Statistic.Value>
                            </Statistic>
                            <ReactStars
                                count={5}
                                value={movieDetails.averageRating}
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
            <Cast casts={movieDetails.cast}/>

            {/*-------------------------movie review-----------------------------*/}
            <div className="movieHeader">
                <Segment clearing basic className='review-header'>
                    <Header as='h2' floated='left'>
                        Reviews
                    </Header>
                    <Button floated='right' inverted color='violet' icon='add' content='Add Review'
                            labelPosition='left'
                            onClick={() => {
                                setAddReview(true)
                            }}
                    />
                </Segment>
                <Divider fitted/>

            </div>
            {
                addReview ?
                    <Grid columns={2} className='review-grid'>
                        <Grid.Row>
                            <Grid.Column width={3} textAlign={"center"} className='reviewer'>

                                <Image className='reviewer-image' circular size='tiny' src={user.avatar}/>

                                <h4 id={user.id} className='reviewer-name'
                                    onClick={handleClickReviewer}>{user.name}</h4>
                                <Item.Description>{moment().format('YYYY-MM-DD HH:mm').toString()}</Item.Description>
                            </Grid.Column>
                            <Grid.Column width={10} className='review-content'>
                                <Form onSubmit={postReview}>
                                    <Form.Input placeholder='Title'
                                                onChange={(e,{value}) => setMyReview({
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
                                    <Button floated='left' className='review-button post-button' type='submit'>Post</Button>
                                    <Button floated='right' className='review-button' onClick={() => {setAddReview(false)}}>Cancel</Button>
                                    </Segment>
                                </Form>
                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                    : null
            }
            {movieDetails.reviews.map((review, index) => (
                <div key={index}>{
                (addReview ? index % 2 !== 0 : index % 2 === 0) ?
                    <Grid columns={2} className='review-grid'>
                        <Grid.Row>
                            <Grid.Column width={3} textAlign='center' className='reviewer'>

                                <Image className='reviewer-image' circular size='tiny' src={review.avatar}/>

                                <h4 id={review.id} className='reviewer-name'
                                    onClick={handleClickReviewer}>{review.name}</h4>
                                <Item.Description>{review.createdTime}</Item.Description>
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
                                <Item.Description className='review-text right'>{review.description}</Item.Description>
                            </Grid.Column>

                            <Grid.Column width={3} textAlign={"center"} className='reviewer'>

                                <Image className='reviewer-image' circular size='tiny' src={review.avatar}/>

                                <h4 id={review.id} className='reviewer-name'>{review.name}</h4>
                                <Item.Description>{review.createdTime}</Item.Description>
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
                            <label>Sorted by: </label>
                            <Form.Radio
                                label='Genre'
                                value='g'
                                checked={sortedBy === 'g'}
                                onChange={handleSortedByCheckbox}
                            />
                            <Form.Radio
                                label='Director'
                                value='d'
                                checked={sortedBy === 'd'}
                                onChange={handleSortedByCheckbox}
                            />

                        </Form.Group>
                    </Form>

                    {/*TODO: call recommend movie api*/}
                    <SimilarMovies recommendations={similarMovies}/>
                </Suspense>
            </div>

        </Container>
    );
}

export default MovieDetails
