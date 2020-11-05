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
    Card, Image, Modal, Popup, List, Dropdown
} from "semantic-ui-react";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import images from "../config/images";

const IconCustom = (props) => (
    <i className="">
        <img width={38} height={38} src={props.src} alt='User Menu Icon'/>
    </i>
);
const PUBLIC = 'public'
const PRIVATE = 'private'

const WishListPublic = () => {
    const history = useHistory()
    const location = useLocation()
    const {id} = useParams()
    const [wishList, setWishList] = useState(
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
        });
    useEffect(() => {
        //TODO: API to fetch wishlist by Id
        //if public load else redirect to home
    },[])
    return (
        <Container>
            <Segment basic className='wishlist-header flex'>
                <Header as='h4' className='wishlist-name'>
                    <Input className='corner labeled' labelPosition='left' type='text'
                           placeholder='Wish List Name'
                           disabled
                    >

                        <Label basic>
                            <IconCustom src={images[wishList.access]}/>
                        </Label>
                        <input value={wishList.name}/>
                    </Input>
                </Header>
                {/*-----------------------wish list options edit,share,delete------------------------*/}
                <Header as='h4' className='wishlist-option'>

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

                                {window.location.href}/{wishList.id}
                                <Button
                                    onClick={() => navigator.clipboard.writeText(window.location.href + '/' + wishList.id)}
                                    className='wishlist-add share-link-button' basic icon='paperclip'
                                />
                            </Segment>
                        </Popup>


                </Header>
            </Segment>
            <Divider fitted/>
            <Container className='wishlist-cards'>
                <Card.Group itemsPerRow={5}>
                    {
                        wishList.movies.map((movie, i) => (

                            <Card className='movieCard' fluid
                                  key={i}
                                  id={movie.id}
                            >
                                <Image src={movie.image}/>
                            </Card>

                        ))
                    }
                </Card.Group>
            </Container>
        </Container>
    );
}
export default WishListPublic
