import React, {Component, lazy, Suspense} from 'react';
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
    Comment,
    Menu,
} from "semantic-ui-react";
import SimilarMovies from "./SimilarMovies";

const Review = (props) => (
    <div>
    <Comment.Group>
        {props.reviews.map((review,index) => (
                <Comment key={index}>
                    <Comment.Avatar  as='a' src={review.avatar}/>
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
        {props.casts.map((cast,index) => (
                <Card key={index}>
                    <Card.Content >
                        <Image floated='left' size='mini' verticalAlign='middle' src= {cast.image} />
                        <Card.Header>{cast.name}</Card.Header>
                        <Card.Meta>{cast.role}</Card.Meta>
                    </Card.Content>
                </Card>
            )
        )}
    </Card.Group>
)


export default class MovieDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieDetails:{
                title:'Spider Man 3',
                image:'/poster.jpg',
                averageRating:4.5,
                description:'Lorem ipsum dolor sit amet, cu principes  eloquentiam mea,' +
                    'per at dolorem consectetuer.  Pri oporteat consulatu intellegamte. ' +
                    'Per no mucius audire perpetua, cum tale iriure phaedrum ad.' +
                    'Usu vulputate consetetur voluptatum te, agam unum dicit cu' +
                    'cum. Fugit prompta deleni in sed, singulis explicari vis cu.',
                genre:'Fiction',
                casts: [
                    {image:'/poster.jpg', name:'Tom Holland', role: 'Peter Parker / Spider-Man'},
                    {image:'/poster.jpg', name:'Samuel L. Jackson', role: 'Nick Fury long long long long long name'},
                    {image:'/poster.jpg', name:'Zendaya', role: 'Harold "Happy" Hogan'},
                    {image:'/poster.jpg', name:'Jon Favreau', role: 'Avebe'},
                    {image:'/poster.jpg', name:'J. B. Smoove', role: 'Julius Dell'},
                ],
                reviews:[
                    {avatar:'/logo192.png', user:'Matt', createdTime:'2020-10-20 15:34', comment:'How artistic!', rate: 4},
                    {avatar:'/logo192.png', user:'Elliot Fu', createdTime:'2020-10-18 15:34', comment:'This has been very useful for my research. Thanks as well!', rate: 4},
                    {avatar:'/logo192.png', user:'Jenny Hess', createdTime:'2020-10-19 15:34', comment:'Elliot you are always so right :)', rate: 3},
                    {avatar:'/logo192.png', user:'Joe Henderson', createdTime:'2020-10-20 15:34', comment:'Dude, this is awesome. Thanks so much', rate: 1.5},
                ],
            },
            myReview:{
                review:'',
                rating:0
            },
            userDetails:{
              name:'Natalie',
              avatar:'/avatar.jpeg',
            },
            similarMovies:[
                {image:'/poster.jpg',title:'Spider Man-1',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-2',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-3',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-4',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-5',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-6',Genre:'Fiction', Director:'Abc'},
                {image:'/poster.jpg',title:'Spider Man-7',Genre:'Fiction', Director:'Abc'},
            ],
            sortedBy:'g',
            addReview:false,
            favorite: false,
            wish: false,
            watched: false,
        }
    }

    postReview = () => {
        const copyReviews = Object.assign([], this.state.movieDetails.reviews)
        let time = moment().format('YYYY-MM-DD HH:mm').toString()
        copyReviews.push({
            avatar: this.state.userDetails.avatar,
            user:this.state.userDetails.name,
            createdTime:time,
            comment:this.state.myReview.review,
            rate: this.state.myReview.rating
        })

        // TODO:call add review api
        this.setState({movieDetails:{...this.state.movieDetails, reviews:copyReviews}})
        this.setState({addReview: false})
        this.setState({myReview: {...this.state.myReview,review: ''}})
        this.setState({myReview: {...this.state.myReview,rating: 0}})

    }

    handleSortedByCheckbox = (e, {value}) => {
        console.log("sorted by ", value)
        this.setState({sortedBy: value})
        //TODO:sort the similarmovies
    }

    handleShare = () =>{
        alert("share a link")
        //TODO: create a link
    }

    ratingChanged = (newRating) => {
        this.setState({myReview: {...this.state.myReview, rating:newRating}})

    }

    render() {
        return (
            <div>
                <Container className='container'>
                    {/*-------------------------movie intro-----------------------------*/}
                    <Grid columns={3} verticalAlign='middle'>
                        <Grid.Row >
                            <Grid.Column width={3}>
                                <Image src={this.state.movieDetails.image} size='small' rounded alt={this.state.movieDetails.title}/>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <h1>{this.state.movieDetails.title}</h1>
                                <p>{this.state.movieDetails.description}</p>
                                <h3>Genre</h3>
                                <p>{this.state.movieDetails.genre}</p>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <div>
                                    <Menu icon='labeled' size='mini' fluid text>
                                        <Menu.Item color='violet'
                                            name='fav'
                                            active={this.state.favorite}
                                            onClick={()=>this.setState({favorite: !this.state.favorite})}>
                                            <Icon name='like' />
                                            Favorite
                                        </Menu.Item>

                                        <Menu.Item color='violet'
                                            name='wish'
                                            active={this.state.wish}
                                            onClick={()=>this.setState({wish: !this.state.wish})}>
                                            <Icon name='star' />
                                            Wish
                                        </Menu.Item>

                                        <Menu.Item color='violet'
                                            name='watched'
                                            active={this.state.watched}
                                            onClick={()=>this.setState({watched: !this.state.watched})}>
                                            <Icon name='check square' />
                                            Watched
                                        </Menu.Item>

                                        <Menu.Item color='blue'
                                            name='share'
                                            active={true}
                                            onClick={this.handleShare}>
                                            <Icon name='share alternate' color='blue'/>
                                            Share
                                        </Menu.Item>
                                    </Menu>
                                </div>


                                <h1> {this.state.movieDetails.averageRating} </h1>

                                <ReactStars
                                    count={5}
                                    value={this.state.movieDetails.averageRating}
                                    size={24}
                                    isHalf={true}
                                    edit={false}
                                    activeColor="#7b68ee"
                                    color='lightgrey'
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/*-------------------------movie cast-----------------------------*/}
                    <h2 className='movieHeader'>Cast</h2>
                    <Divider/>
                    <Cast casts={this.state.movieDetails.casts}/>

                    {/*-------------------------movie review-----------------------------*/}
                    <div className="movieHeader">
                        <Grid  verticalAlign="bottom" columns={2}>
                            <Grid.Column floated='left'>
                                <h2>Review</h2>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <Button inverted color='violet' icon='add' content='Add Review'
                                        labelPosition='left'
                                        onClick={() =>{this.setState({addReview: true})}}
                                />
                            </Grid.Column>
                        </Grid>
                        <Divider/>

                        {
                            this.state.addReview ?
                                <div>

                                    <Grid verticalAlign='middle' padded>
                                        <Grid.Column width={14}>
                                            <Form>
                                                <Form.TextArea style={{minHeight:200}}
                                                            placeholder="Tell us what you think about this movie..."
                                                               onChange={(event)=>this.setState({myReview: {...this.state.myReview,review:event.target.value}})}
                                                />
                                                <Button onClick={()=>{this.setState({addReview:false})}}>Cancel</Button>
                                                <Button className='postButton' onClick={this.postReview}> Post </Button>
                                            </Form>
                                        </Grid.Column>
                                        <Grid.Column width={2} >
                                            <div >
                                                <Image className='imageSize' circular src={this.state.userDetails.avatar} size='mini'/>
                                            </div>

                                            <div className='user'>
                                                <h3>{this.state.userDetails.name}</h3>
                                                {/*<Rating icon='star'*/}
                                                {/*              size='large'*/}
                                                {/*              maxRating={5} clearable />*/}
                                                <ReactStars
                                                    count={5}
                                                    onChange={this.ratingChanged}
                                                    size={24}
                                                    isHalf={true}
                                                    emptyIcon={<Icon name='star outline'/>}
                                                    halfIcon={<Icon name='star half'/>}
                                                    fullIcon={<Icon name='star'/>}
                                                    activeColor="#7b68ee"
                                                    color='lightgrey'
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                                : null
                        }
                        <Review reviews={this.state.movieDetails.reviews}/>
                    </div>

                    {/*-------------------------similar movies-----------------------------*/}
                    <div className="movieHeader">
                        <h2>Similar Movies</h2>
                        <Divider/>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Form>
                                <Form.Group inline>
                                    <label>Sorted by: </label>
                                    <Form.Radio
                                        label= 'Genre'
                                        value= 'g'
                                        checked={this.state.sortedBy === 'g'}
                                        onChange={this.handleSortedByCheckbox}
                                    />
                                    <Form.Radio
                                        label= 'Director'
                                        value= 'd'
                                        checked={this.state.sortedBy === 'd'}
                                        onChange={this.handleSortedByCheckbox}
                                    />

                                </Form.Group>
                            </Form>

                            {/*TODO: call recommend movie api*/}
                            <SimilarMovies recommendations={this.state.similarMovies}/>
                        </Suspense>
                    </div>

                </Container>
            </div>
        );
    }
}

