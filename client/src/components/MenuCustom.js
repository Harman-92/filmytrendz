import React from 'react';
import '../style/MenuCustom.css';
import {Grid, Menu, Divider} from "semantic-ui-react";
import IconCustom from "./IconCustom";
import images from "../config/images";
const MenuCustom = () => {
    const [activeItem, setActiveItem] = React.useState('fav')
    const handleClick = (e, {name}) => {
        setActiveItem(name)
    }
    return (
        <div>
            <Grid padded className='menu-grid'>
                <Grid.Row>
                    <Menu compact icon='labeled' size='mini' fluid color='black' as='div' text>
                        <Menu.Item
                            name='fav'
                            active={activeItem === 'fav'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.favorite}/>
                            Favourites
                        </Menu.Item>

                        <Menu.Item
                            name='wish'
                            active={activeItem === 'wish'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.wishList}/>
                            Wish List
                        </Menu.Item>

                        <Menu.Item
                            name='watch'
                            active={activeItem === 'watch'}
                            onClick={handleClick}
                            className='menu-icon'
                        >
                            <IconCustom src={images.watched}/>
                            Watched
                        </Menu.Item>
                    </Menu>
                </Grid.Row>
                <Grid.Row>
                    <Menu compact icon='labeled' size='mini' fluid color='black' as='div' text>
                        <Menu.Item
                            name='review'
                            active={activeItem === 'review'}
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
