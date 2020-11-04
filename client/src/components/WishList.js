import React, {useEffect, useState} from 'react';
import '../style/WishList.css';
import {
    Button,
    Divider,
    Header,
    Icon,
    Segment,
    Container,
    Input,
    Label,
    Card,
    Image,
    Modal,
    Popup,
    Dropdown
} from "semantic-ui-react";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {isAuthenticated} from "../config/session";
import images from "../config/images";

const IconCustom = (props) => (
    <i className="">
        <img width={38} height={38} src={props.src} alt='User Menu Icon'/>
    </i>
);
const PUBLIC = 'public'
const PRIVATE = 'private'

const WishList = () => {
    const history = useHistory()
    const location = useLocation()
    const {id} = useParams()
    const [isLogin, setIsLogin] = useState(isAuthenticated)
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        url: '',
    })
    const [wishList, setWishList] = useState([
        {
            id: 43,
            name: 'Nerves of Steel',
            access: 'public',
            movies: [
                {
                    id: 64,
                    title: 'Spider Man 1',
                    image: '/poster.jpg',
                    averageRating: 4,
                },
                {
                    id: 65,
                    title: 'Spider Man 2',
                    image: '/poster.jpg',
                    averageRating: 2.5,
                },
                {
                    id: 66,
                    title: 'Spider Man 3',
                    image: '/poster.jpg',
                    averageRating: 3.5,
                },
                {
                    id: 67,
                    title: 'Spider Man 4',
                    image: '/poster.jpg',
                    averageRating: 5,
                }
            ]
        }, {
            id: 42,
            name: 'Cyberpunk',
            access: 'private',
            movies: [
                {
                    id: 68,
                    title: 'Spider Man 5',
                    image: '/poster.jpg',
                    averageRating: 4,
                },
                {
                    id: 69,
                    title: 'Spider Man 6',
                    image: '/poster.jpg',
                    averageRating: 2.5,
                },
                {
                    id: 61,
                    title: 'Spider Man 7',
                    image: '/poster.jpg',
                    averageRating: 3.5,
                },
                {
                    id: 62,
                    title: 'Spider Man 8',
                    image: '/poster.jpg',
                    averageRating: 5,
                }
            ]
        }
    ]);
    const [isEditId, setIsEditId] = useState(0)
    const [isDeleteId, setIsDeleteId] = useState(0)
    const [open, setOpen] = useState(false)
    const [isAddWishList, setIsAddWishList] = useState(false)
    const [newWishList, setNewWishList] = useState({
        name: '',
        access: PUBLIC,
        movies: []
    })
    const accessOptions = [
        {
            key: PUBLIC,
            text: 'Public',
            value: PUBLIC,
            image: {avatar: true, src: images.public},
        },
        {
            key: PRIVATE,
            text: 'Private',
            value: PRIVATE,
            image: {avatar: true, src: images.private},
        },
    ]
    const handleEditClick = (wishListId) => {
        if (wishListId === isEditId) {
            setIsEditId(0)
        } else {
            setIsEditId(wishListId)
            setNewWishList({
                ...newWishList,
                name: wishList.find(x => x.id === wishListId).name
            })
        }
    }
    const handleDeleteClick = (wishListId) => {
        setIsDeleteId(wishListId)
    }
    const handleDeleteCancel = () => {
        setIsDeleteId(0)
        setOpen(false)
    }
    const handleDeleteConfirm = () => {
        //TODO: API to delete isDeleteId wishlist
        setWishList(wishlist => wishlist.filter(w => w.id !== isDeleteId))
        setOpen(false)
    }
    const handleRemoveMovie = (movieId) => {
        // console.log(e.target.parentElement.id)
        //TODO:API to remove movie from wishList isEditId
        let wishLists = [...wishList]
        for (let w of wishLists) {
            if (w.id === isEditId) {
                w.movies = w.movies.filter(m => m.id !== movieId)
            }
        }
        setWishList(wishLists)

    }
    const handleCreateWishList = () => {
        let copyWishList = [...wishList]
        copyWishList.splice(0, 0, {
            id: 44,
            name: newWishList.name,
            access: newWishList.access,
            movies: newWishList.movies
        })
        setWishList(copyWishList)
        setNewWishList({
            name: '',
            access: PUBLIC,
            movies: []
        })
        setIsAddWishList(false)
    }
    const handleSaveEditWishlist = () => {
        //TODO: API call to edit wishlist name
        let copyWishList = [...wishList]
        copyWishList.find(x => x.id === isEditId).name = newWishList.name
        setWishList(copyWishList)
        setNewWishList({...newWishList, name: ''})
        setIsEditId(0)
    }
    const handleAccessChange = (wishListId, value) => {
        let copyWishList = [...wishList]
        copyWishList.find(x => x.id === wishListId).access = value
        setWishList(copyWishList)
        //TODO: API to change wishlist access
    }
    useEffect(() => {
        console.log(id)
        //TODO:API to fetch wishlists details
    }, [])
    useEffect(() => {
        if (!isLogin) {
            history.push('/')
        }
    }, [location, isLogin])

    return (
        <Container>

            {/*-----------------------Add New Wishlist-------------------------------*/}

            <Segment basic clearing className='add-wishlist wishlist-header'>
                {isAddWishList ?
                    <div>
                        <Header as='h4' floated='left' className='wishlist-name'>
                            <Input className='corner labeled' labelPosition='left' type='text'
                                   placeholder='Wish List Name'
                                   onChange={(e, {value}) => setNewWishList({...newWishList, name: value})}
                            ><Dropdown
                                className='access'
                                trigger={
                                    <Label basic>
                                        <IconCustom src={images[newWishList.access]}/>
                                    </Label>}
                                value={newWishList.access}
                                defaultValue={newWishList.access}
                                onChange={(e, {value}) => setNewWishList({...newWishList, access: value})}
                                options={accessOptions}
                            />
                                <input onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        handleCreateWishList()
                                    }
                                }}/>
                            </Input>
                        </Header>
                        <Button floated='right' basic color='grey' icon='x'
                                content='Cancel'
                                labelPosition='left'
                                onClick={() => setIsAddWishList(false)}
                        />
                    </div>
                    :
                    <Button floated='right' basic color='violet' icon='add'
                            content='Add Wish List'
                            labelPosition='left'
                            onClick={() => setIsAddWishList(true)}
                    />
                }
            </Segment>

            {/*---------------------------Load Wish lists--------------------------------*/}

            {wishList.map((w, i) => (
                <div key={i}>
                    <Segment basic className='wishlist-header flex'>
                        <Header as='h4' className='wishlist-name'>
                            <Input className='corner labeled' labelPosition='left' type='text'
                                   placeholder='Wish List Name'
                                   disabled={isEditId !== w.id}
                                   onChange={(e, {value}) => setNewWishList({...newWishList, name: value})}
                            >
                                {/*------------Access dropdown----------------*/}
                                <Dropdown
                                    className='access'
                                    trigger={
                                        <Label basic>
                                            <IconCustom src={images[w.access]}/>
                                        </Label>}
                                    value={w.access}
                                    defaultValue={w.access}
                                    onChange={(e, {value}) => handleAccessChange(w.id, value)}
                                    options={accessOptions}
                                />
                                {/*--------------wish list name------------------*/}
                                <input value={isEditId !== w.id ? w.name : newWishList.name}
                                       onKeyPress={event => {
                                           if (event.key === 'Enter') {
                                               handleSaveEditWishlist()
                                           }
                                       }}
                                />
                            </Input>
                        </Header>
                        {/*-----------------------wish list options edit,share,delete------------------------*/}
                        <Header as='h4' className='wishlist-option'>
                            <Icon name='pencil' inverted color='violet' onClick={() => handleEditClick(w.id)}/>
                            {w.access === PUBLIC ?
                                <Popup
                                    position='bottom right'
                                    trigger={
                                        <Icon name='share alternate' color='blue'/>
                                    }
                                    on='click'
                                    className='share-popup'
                                    flowing={false}
                                    hideOnScroll
                                >
                                    <Segment basic className='share-link'>

                                        {window.location.href}/{w.id}
                                        <Button
                                            onClick={() => navigator.clipboard.writeText(window.location.href + '/' + w.id)}
                                            className='wishlist-add share-link-button' basic icon='paperclip'
                                        />
                                    </Segment>
                                </Popup> : null
                            }
                            <Modal
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                open={isDeleteId === w.id}
                                trigger={
                                    <Icon name='trash alternate outline' inverted color='violet'
                                          onClick={() => handleDeleteClick(w.id)}/>
                                }
                                size='tiny'
                            >
                                <Modal.Content>
                                    <h4>
                                        Are you sure  to remove
                                        <span className='spanStyle'>  "{w.name}" </span>?
                                    </h4>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='red' onClick={handleDeleteConfirm}>
                                        <Icon name='trash alternate outline' /> REMOVE
                                    </Button>
                                    <Button onClick={handleDeleteCancel}>
                                        <Icon name='cancel' /> CANCEL
                                    </Button>
                                </Modal.Actions>

                            </Modal>
                        </Header>
                    </Segment>
                    <Divider fitted/>
                    {/*--------------------------Movies container-----------------------------------*/}
                    <Container className='wishlist-cards'>
                        <Card.Group itemsPerRow={5}>
                            {
                                w.movies.map((movie, j) => (

                                    <Card className='movieCard' fluid
                                          key={j}
                                          id={movie.id}
                                    >
                                        <Image src={movie.image}/>
                                        {isEditId === w.id ?
                                            <Icon color='red' name='x' onClick={() => handleRemoveMovie(movie.id)}/>
                                            : null
                                        }
                                    </Card>

                                ))
                            }
                        </Card.Group>
                    </Container>
                </div>
            ))

            }

        </Container>
    );
}


export default WishList;
