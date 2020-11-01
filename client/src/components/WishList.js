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
    Card, Image, Modal, Popup
} from "semantic-ui-react";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {getUserInfo, isAuthenticated} from "../config/session";

const WishList = () => {
    const history = useHistory()
    const location = useLocation()
    const {id} = useParams()
    const [isLogin, setIsLogin] = useState(false)
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
        name:'',
        access:'',
        movies:[]
    })
    const handleEditClick = (e) => {
        if (parseInt(e.target.offsetParent.parentElement.id) === isEditId) {
            setIsEditId(0)
        } else {
            setIsEditId(parseInt(e.target.offsetParent.parentElement.id))
        }
    }
    const handleDeleteClick = (e) => {
        setIsDeleteId(parseInt(e.target.offsetParent.parentElement.id))
    }
    const handleDeleteCancel = () => {
        setIsDeleteId(0)
        setOpen(false)
    }
    const handleDeleteConfirm = () => {
        //TODO: API to delete isDeleteId wishlist
        setWishList(wishlist=>wishlist.filter(w=>w.id!==isDeleteId))
        setOpen(false)
    }
    const handleRemoveMovie = (e) => {
        // console.log(e.target.parentElement.id)
        //TODO:API to remove movie from wishList isEditId
        let wishLists = [...wishList]
        for (let w of wishLists) {
            if (w.id === isEditId) {
                w.movies = w.movies.filter(m => m.id !== parseInt(e.target.parentElement.id))
            }
        }
        setWishList(wishLists)

    }
    const handleCreateWishList = () => {
        let copyWishList = [...wishList]
        copyWishList.splice(0, 0, {
            id: 44,
            name: newWishList.name,
            access: 'private',//newWishList.access,
            movies: newWishList.movies
        })
        setWishList(copyWishList)
        setNewWishList({
            name: '',
            access: '',
            movies: []
        })
        setIsAddWishList(false)
    }

    useEffect(() => {
        console.log(id)
        //TODO:API to fetch wishlists details
    },[])
    useEffect(() => {
        setIsLogin(isAuthenticated())
        if (isLogin) {
            setUser(getUserInfo)
        }else{
            history.push('/')
        }
    }, [location, isLogin])

    return (
        <Container>
            <Segment basic clearing className='add-wishlist wishlist-header'>
                {isAddWishList ?
                    <div>
                        <Header as='h4' floated='left' className='wishlist-name'>
                            <Input className='corner labeled' labelPosition='left' type='text'
                                   placeholder='Wish List Name'
                                   onChange={(e, {value}) => setNewWishList({...newWishList,name: value})}
                            >
                                <Label basic><Icon name='lock' className='access'/></Label>
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
            {wishList.map((w, i) => (
                <div id={w.id} key={i}>
                    <Segment basic className='wishlist-header flex'>
                        <Header as='h4' className='wishlist-name'>
                            <Input className='corner labeled' labelPosition='left' type='text'
                                   placeholder='Wish List Name' disabled={isEditId !== w.id}>
                                <Label basic><Icon name='lock' className='access'/></Label>
                                <input value={w.name}/>
                            </Input>
                        </Header>
                        <Header as='h4' className='wishlist-option'>
                            <Icon name='pencil' inverted color='violet' onClick={handleEditClick}/>
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
                                    <Button onClick={() => navigator.clipboard.writeText(window.location.href+'/'+w.id)}
                                            className='wishlist-add share-link-button' basic icon='paperclip'
                                    />
                                </Segment>
                            </Popup>

                            <Modal
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                open={isDeleteId === w.id}
                                trigger={
                                    <Icon name='trash alternate outline' inverted color='violet'
                                          onClick={handleDeleteClick}/>
                                }
                                size='tiny'
                            >
                                <Segment basic clearing textAlign='center'>
                                    <Header>Do you wish to delete "{w.name}"?</Header>
                                    <Segment basic className='wishlist-header'>
                                    <Button floated='left' color='grey' onClick={handleDeleteCancel}>
                                        Cancel
                                    </Button>
                                    <Button color='violet' floated='right' onClick={handleDeleteConfirm}>
                                        Confirm
                                    </Button>
                                    </Segment>
                                </Segment>
                            </Modal>
                        </Header>
                    </Segment>
                    <Divider fitted/>
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
                                            <Icon color='red' name='x' onClick={handleRemoveMovie}/>
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
