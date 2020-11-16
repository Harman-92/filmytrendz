import React, {useState} from 'react';
import PropTypes from 'prop-types';
import '../style/AboutUs.css';
import {Container, Divider, Grid, Image} from "semantic-ui-react";
import images from "../config/images";

const AboutUs = () => {
    const [data, setData] = useState([
        {
            name: 'Adi Teja Dasari',
            zid: 'z5325276',
            role: 'Scrum Master / Frontend developer',
            image: '/about/adi.jpg',
            bio: 'It has been a great journey of end to end development following Agile methodology. ' +
                'Coming from a professional background, working with Filmy Trendz helped me to enhance my skills ' +
                'and also aware of challenges involved in terms of project management and software development.'
        }, {
            name: 'Yinghong Zhong',
            zid: 'z5233608',
            role: 'Frontend developer',
            image: '/about/nat.jpg',
            bio: 'I am very happy to work on front-end and complete this project following Agile. ' +
                'It\'s a really interesting and variable experience to improve my coding and project ' +
                'management skills. So glad to work in a passionate team V5!'
        }, {
            name: 'Wei Song',
            zid: 'z5198433',
            role: 'Backend developer',
            image: '/about/wei.jpg',
            bio: 'It is really happy working with my team members, they are professionals. ' +
                'As a backend developer I contribute myself to building the backend Api, ' +
                'and I learned MVC concepts in api design, git skills and AWS services. ' +
                'We are the best team!!!'
        }, {
            name: 'Allen K',
            zid: 'z5232188',
            role: 'Backend developer',
            image: '/about/allen.jpg',
            bio: 'I like to work as a backend team member,'+
            'partly because of the flexibility in ways to achieve results'+
            'I learned a lot from my team mates too'
        }, {
            name: 'Harmanpreet Singh',
            zid: 'z5228917',
            role: 'Backend developer',
            image: '/about/harman.jpg',
            bio: 'Being a movie buff, it was very exciting to work on this project. '+
                'My focus was to create a robust recommendation system that I can enjoy as a user. '+
                'Really happy with what we have achieved as a team in such a short time!'
        }
    ])
    return (
        <Container className="AboutUs">
            <Image src={images.topBanner} className='bannerSetting'/>
            <Grid>
                 {data.map((z, index) => (
                <ProfileCard key={index} z={z} i={index}/>
            ))}
            </Grid>
        </Container>
    );
}

const ProfileCard = ({z, i}) => (

    <Grid.Row className='rowSetting' verticalAlign='middle'>
        <Grid.Column width={3}>
            <Image circular src={z.image} wrapped bordered/>
        </Grid.Column>
        <Grid.Column width={12} className='columnSetting'>
            <p style={{fontSize: 20, fontWeight: 'bold'}}>{z.name} <span as='p' className='zid'> {z.zid}</span></p>
            <p style={{fontSize: 16, fontWeight: 'bold'}}>{z.role}</p>
            <p style={{fontSize: 16}}>{z.bio}</p>
            {i < 4 ? <Divider className='contentDivider'/> :null}
        </Grid.Column>

    </Grid.Row>
)

ProfileCard.propTypes = {
    z: PropTypes.object.isRequired
};

AboutUs.defaultProps = {};

export default AboutUs;
