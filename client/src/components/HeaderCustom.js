import React from 'react';
import '../style/HeaderCustom.css';
import {Image, Input, Segment, Popup, Button, Icon} from "semantic-ui-react";
import MenuCustom from "./MenuCustom";
import images from "../config/images";
const HeaderCustom = (props) => {
    return (
        <Segment vertical className='header-segment'>
            <Image className='logo' src={images.logo} floated='left' size={"small"}/>
            <Input className='search' type='text' placeholder='Search...' action>
                <input />
                <Button icon basic labelPosition='right' onClick={() => props.setVisible2(true)}>
                    filter
                    <Icon className='filter-icon' name='down arrow' />
                </Button>
                <Button className='button' type='submit'>Search</Button>
            </Input>
            {!props.isLogin?
                <Button.Group size='medium' floated='right'>
                    <Button className='custom-menu button' onClick={() => props.handleTab(true, 0)}>Login</Button>
                    <Button.Or className='custom-menu' />
                    <Button className='custom-menu button' onClick={() => props.handleTab(true, 1)}>Register</Button>
                </Button.Group>
                :
                <div className='custom-menu menu-div'>
                    <span className='menu-text'>Hey, Lorem</span>
                    <Popup wide
                           position='bottom right'
                           trigger={<Image className='menu-image' src='/empty_image.png' circular floated='right'/>} on='click'>
                        <MenuCustom/>
                    </Popup>
                </div>
            }
        </Segment>
    );
}

HeaderCustom.propTypes = {};

HeaderCustom.defaultProps = {};

export default HeaderCustom;
