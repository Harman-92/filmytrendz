import React from 'react';
import '../style/MenuCustom.css';
import {Grid, Menu, Divider} from "semantic-ui-react";
import images from "../config/images";
import {useHistory} from "react-router-dom";
import {removeAccessToken} from "../util/Session";

const IconCustom = (props) => (
    <i className="">
        <img width={38} height={38} src={props.src} alt='User Menu Icon'/>
    </i>
);

const MenuCustom = ({setOpen}) => {
    const history = useHistory()
    const [activeItem, setActiveItem] = React.useState('')
    const handleClick = (e, {name}) => {
        setActiveItem(name)
        setOpen(false)
        if (name === 'logout') {
            removeAccessToken()
            history.push('/')
        } else {
            history.push('/' + name)
        }
    }
    return (
        <div>
            <Grid padded className='menu-grid'>
                <Grid.Row>
                    <Menu className='user-menu' compact icon='labeled' size='mini' fluid color='black' as='div' text>
                        <Menu.Item
                            name='favorite'
                            active={activeItem === 'favorite'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.favorite}/>
                            Favourites
                        </Menu.Item>

                        <Menu.Item
                            name='wishlist'
                            active={activeItem === 'wishlist'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.wishList}/>
                            Wish List
                        </Menu.Item>

                        <Menu.Item
                            name='watched'
                            active={activeItem === 'watched'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.watched}/>
                            Watched
                        </Menu.Item>
                    </Menu>
                </Grid.Row>
                <Grid.Row>
                    <Menu className='user-menu' compact icon='labeled' size='mini' fluid color='black' as='div' text>
                        <Menu.Item
                            name='reviewed'
                            active={activeItem === 'reviewed'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.reviewed}/>
                            Reviewed
                        </Menu.Item>
                        <Menu.Item
                            name='profile'
                            active={activeItem === 'profile'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.profile}/>
                            Profile
                        </Menu.Item>
                        <Menu.Item
                            name='logout'
                            active={activeItem === 'logout'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.logout}/>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Grid.Row>
            </Grid>
            <Divider/>
            <Grid padded='horizontally'>
                <Grid.Column>
                    <Menu text vertical>
                        <Menu.Item
                            name='FAQ'
                            active={activeItem === 'FAQ'}
                            onClick={handleClick}
                        />
                        <Menu.Item
                            name='contact'
                            active={activeItem === 'contact'}
                            onClick={handleClick}
                        />
                    </Menu>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default MenuCustom;
