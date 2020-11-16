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
    Popup
} from "semantic-ui-react";
import {useHistory, useParams} from 'react-router-dom';
import images from "../config/images";
import api from "../config/axios";
import response from "../config/response";

const IconCustom = (props) => (
    <i className="">
        <img width={38} height={38} src={props.src} alt='User Menu Icon'/>
    </i>
);
const PUBLIC = 'PUBLIC'
const WishListPublic = () => {
    const history = useHistory()
    const {id} = useParams()
    const [wishList, setWishList] = useState({
        movies: []
    });
    useEffect(() => {
        api.get('/wishlist/'+id).then((res) => {
            if (res.status === 200) {
                if(res.data.error){
                    alert(res.data.error)
                    history.push('/')
                }else{
                    setWishList(res.data)
                }
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    },[history, id])
    return (
        <Container>
            <Segment basic className='wishlist-header flex'>
                <Header as='h4' className='wishlist-name'>
                    <Input className='corner labeled' labelPosition='left' type='text'
                           placeholder='Wish List Name'
                           disabled
                    >

                        <Label basic>
                            <IconCustom src={images[wishList.status]}/>
                        </Label>
                        <input value={wishList.name}/>
                    </Input>
                </Header>
                {/*-----------------------wish list options edit,share,delete------------------------*/}
                <Header as='h4' className='wishlist-option'>

                    {wishList.status === PUBLIC ?
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
                                    {window.location.href}
                                    <Button
                                        onClick={() => navigator.clipboard.writeText(window.location.href + '/' + wishList.id)}
                                        className='wishlist-add share-link-button' basic icon='paperclip'
                                    />
                                </Segment>
                        </Popup>

                        : null
                    }

                </Header>
            </Segment>
            <Divider fitted/>
            <Container className='wishlist-cards'>
                <Card.Group itemsPerRow={5}>
                    {
                        wishList.movies.map((movie, index) => (
                            <Card className='movieCard' fluid key={index}>
                                <Image src={movie.url === ''?images.no_image:movie.url}/>
                                <Card.Content as={'div'} className='movie-card-content'>
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
        </Container>
    );
}
export default WishListPublic
