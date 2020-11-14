import React, {useState} from 'react';
import PropTypes from 'prop-types';
import '../style/AboutUs.css';
import {Card, Container, Grid, Image, Segment} from "semantic-ui-react";
import images from "../config/images";

const AboutUs = () => {
    const [data, setData] = useState([
        {
            name: 'Adi Teja Dasari',
            zid: 'z5325276',
            role: 'Scrum Master / Frontend developer',
            image: '/about/adi.jpg',
            bio: 'Hello'
        }, {
            name: 'Natalie Zhong',
            zid: 'z5325276',
            role: 'Frontend developer',
            image: images.no_profile,
            bio: 'Hello'
        }, {
            name: 'Wei Song',
            zid: 'z5325276',
            role: 'Backend developer',
            image: '/about/wei.jpg',
            bio: 'Hello'
        }, {
            name: 'Allen K',
            zid: 'z5325276',
            role: 'Backend developer',
            image: images.no_profile,
            bio: 'Hello'
        }, {
            name: 'Harman',
            zid: 'z5325276',
            role: 'Backend developer',
            image: images.no_profile,
            bio: 'Hello'
        }
    ])
    return (
        <Container className="AboutUs">
            <Grid columns={5}>
                {data.map((z, index) => (
                    <ProfileCard key={index} z={z}/>
                ))}
            </Grid>
        </Container>
    );
}

const ProfileCard = ({z}) => (
    <Grid.Column width={3} className='about-card'>
        <Card>
            <Card.Content className='info'>
                <Image circular src={z.image} wrapped/>
                <Card.Header>{z.name}</Card.Header>
                <Card.Meta>
                    <span className='date'>{z.zid}</span>
                </Card.Meta>
                <Card.Description>
                    {z.role}
                </Card.Description>
            </Card.Content>
            <Card.Content extra className='bio'>
                <Card.Description>
                    {z.bio}
                </Card.Description>
            </Card.Content>
        </Card>
    </Grid.Column>
)

ProfileCard.propTypes = {
    z: PropTypes.object.isRequired
};

AboutUs.defaultProps = {};

export default AboutUs;
