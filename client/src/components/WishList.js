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
import {useHistory, useLocation} from 'react-router-dom';
import {isAuthenticated} from "../config/session";
import images from "../config/images";
import api from "../config/axios";
import response from "../config/response";

const IconCustom = (props) => (
    <i className="">
        <img width={38} height={38} src={props.src} alt='User Menu Icon'/>
    </i>
);
const PUBLIC = 'PUBLIC'
const PRIVATE = 'PRIVATE'

const WishList = () => {
    const history = useHistory()
    const location = useLocation()
    const [wishList, setWishList] = useState([]);
    const [isEditId, setIsEditId] = useState(0)
    const [isDeleteId, setIsDeleteId] = useState(0)
    const [open, setOpen] = useState(false)
    const [isAddWishList, setIsAddWishList] = useState(false)
    const [newWishList, setNewWishList] = useState({
        name: '',
        status: PUBLIC,
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
        api.delete('/wishlist/'+isDeleteId).then((res) => {
            if (res.status === 200) {
                setWishList(wishlist => wishlist.filter(w => w.id !== isDeleteId))
                setOpen(false)
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }
    const handleRemoveMovie = (movieId) => {
        api.post('/wishlist/'+isEditId,{
            'remove_list': [movieId]
        }).then((res) => {
            if (res.status === 200) {
                if(res.data.error){
                    alert(res.data.error)
                }else {
                    let wishLists = [...wishList]
                    for (let w of wishLists) {
                        if (w.id === isEditId) {
                            w.movies = w.movies.filter(m => m.id !== movieId)
                        }
                    }
                    setWishList(wishLists)
                }
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })

    }
    const handleCreateWishList = () => {
        api.put('/wishlist',{
            'name': newWishList.name,
            'status': newWishList.status
        }).then((res) => {
            if (res.status === 200) {
                let copyWishList = [...wishList]
                copyWishList.splice(0, 0, {
                    id: res.data.id,
                    name: newWishList.name,
                    status: newWishList.status,
                    movies: newWishList.movies
                })
                setWishList(copyWishList)
                setNewWishList({
                    name: '',
                    status: PUBLIC,
                    movies: []
                })
                setIsAddWishList(false)
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })

    }
    const handleSaveEditWishlist = () => {
        api.post('/wishlist/'+isEditId,{
            'name': newWishList.name
        }).then((res) => {
            if (res.status === 200) {
                if(res.data.error){
                    alert(res.data.error)
                }else {
                    let copyWishList = [...wishList]
                    copyWishList.find(x => x.id === isEditId).name = newWishList.name
                    setWishList(copyWishList)
                    setNewWishList({...newWishList, name: ''})
                    setIsEditId(0)
                }
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }
    const handleAccessChange = (wishListId, value) => {
        api.post('/wishlist/'+wishListId,{
            'status': value
        }).then((res) => {
            if (res.status === 200) {
                if(res.data.error){
                    alert(res.data.error)
                }else {
                    let copyWishList = [...wishList]
                    copyWishList.find(x => x.id === wishListId).status = value
                    setWishList(copyWishList)
                }
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }
    useEffect(() => {
        if (isAuthenticated()) {
            api.get('/wishlist').then((res) => {
                if (res.status === 200) {
                    setWishList(res.data.wishlists)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        }else{
            history.push('/')
        }
    }, [location, history])

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
                                        <IconCustom src={images[newWishList.status]}/>
                                    </Label>}
                                value={newWishList.status}
                                onChange={(e, {value}) => setNewWishList({...newWishList, status: value})}
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
                                            <IconCustom src={images[w.status]}/>
                                        </Label>}
                                    value={w.status}
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
                            {w.status === PUBLIC ?
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
                            {/*-----------------delete wish list modal-------------------------*/}
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
                                        Are you sure to remove
                                        <span className='spanStyle'>  "{w.name}" </span>?
                                    </h4>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={handleDeleteCancel}>
                                        <Icon name='cancel'/> CANCEL
                                    </Button>
                                    <Button color='red' onClick={handleDeleteConfirm}>
                                        <Icon name='trash alternate outline'/> REMOVE
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
                                    >
                                        <Image src={movie.url}/>
                                        <Card.Content as={'div'} className='movie-card-content'>
                                            {
                                                isEditId === w.id ?
                                                    <Label as='a' corner='right' color='violet' icon='x'
                                                         onClick={() => handleRemoveMovie(movie.id)} />: null
                                            }
                                            <div  className='cardContentView'
                                                  onClick={() => history.push('/movie/' + movie.id)}>
                                                <Card.Header className='cardContext'>{movie.title}</Card.Header>
                                                <Divider className='cardDivider'/>
                                                <Card.Meta className='cardContext'>Released in {movie.year}</Card.Meta>
                                                <div>
                                                    <Icon name='star' inverted color='violet'/> {movie.rating}
                                                </div>
                                            </div>

                                        </Card.Content>
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
