import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import '../style/Profile.css';
import {
    Accordion,
    Button,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Message,
    Segment,
    Reveal
} from 'semantic-ui-react';
import '../style/SignUp.css';
import images from "../config/images";
import {getUserInfo} from "../config/session";

const Banned = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e, {index}) => {
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex)
    }

    return (
        <Accordion>
            <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={handleClick}
            >
                <Icon name='dropdown'/>
                Banned list
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
                <p>
                    Banned users list
                </p>
            </Accordion.Content>
        </Accordion>
    )
}


const Profile = () => {
    const location = useLocation()
    const [user, setUser] = useState({
        id: '',
        email: 'timeisprecious@vision.com',
        firstName: 'Erwin',
        lastName: 'Schrodinger',
        mobile: '0515387256',
        url: ''
    })
    const [newUser, setNewUser] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile
    })
    const [err, setErr] = useState({
        firstName: false,
        lastName: false,
        mobile: false
    })
    const [isProfileEdit, setIsProfileEdit] = useState(false)
    const [oldPassword, setOldPassword] = useState({v: '', e: false});
    const [newPassword, setNewPassword] = useState({v: '', e: false});
    const [retypePassword, setRetypePassword] = useState({v: '', e: false});
    const [submit, setSubmit] = useState({
        formError: false,
        loginError: false,
        success: false
    });

    const handleProfileSave = () => {
        if (err.firstName || err.lastName || err.mobile || user.firstName === "" || user.lastName === "" || user.mobile === "") {
            if (user.firstName === "") {
                setErr({
                    ...err,
                    firstName: true
                })
            }
            if (user.lastName === "") {

                setErr({
                    ...err,
                    lastName: true
                })
            }
            if (user.mobile === "") {

                setErr({
                    ...err,
                    mobile: true
                })
            }
            alert("please give valid input")
        }
        //TODO: API to update profile
        setUser({
            ...user,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            mobile: newUser.mobile
        })
        setIsProfileEdit(false)
    }
    const handleSubmit = () => {
        if (oldPassword.v === "" || newPassword.v === "" || retypePassword.v === "" || retypePassword.e) {
            if (oldPassword.v === "") {
                setOldPassword({
                    v: oldPassword.v,
                    e: true
                })
            }
            if (newPassword.v === "") {
                setNewPassword({
                    v: newPassword.v,
                    e: true
                })
            }
            if (retypePassword.v === "") {
                setRetypePassword({
                    v: retypePassword.v,
                    e: true
                })
            }

            setSubmit({
                formError: true,
                loginError: false,
                success: false
            })
        }
        //TODO: API to change password
    }
    const handleCancel = () => {
        setIsProfileEdit(false)
        setNewUser({
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile
        })
    }
    const handlePasswordMatch = (e, {value}) => {
        if (value === newPassword.v) {
            setRetypePassword({
                v: value,
                e: false
            })
        } else {
            setRetypePassword({
                v: value,
                e: true
            })
        }
    }
    const handleUpload = () => {
        if (isProfileEdit) {
            alert('upload image')
        }
    }
    const handleFirstName = (e, {value}) => {

        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        setNewUser({
            ...newUser,
            firstName: value
        })
        if (pattern.test(value) || value === "") {
            setErr({
                ...err,
                firstName: false
            })
        } else {
            setErr({
                ...err,
                firstName: true
            })
        }
    }
    const handleLastName = (e, {value}) => {

        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        setNewUser({
            ...newUser,
            lastName: value
        })
        if (pattern.test(value) || value === "") {
            setErr({
                ...err,
                lastName: false
            })
        } else {
            setErr({
                ...err,
                lastName: true
            })
        }
    }
    const handleMobile = (e, {value}) => {
        const pattern = new RegExp(/^[0-9]+$/)
        setNewUser({
            ...newUser,
            mobile: value
        })
        if ((pattern.test(value) || value === "") && value.length === 10) {
            setErr({
                ...err,
                mobile: false
            })
        } else {
            setErr({
                ...err,
                mobile: true
            })
        }
    }

    useEffect(() => {
        setSubmit({
            formError: false,
            loginError: false,
            success: false
        })
    }, [oldPassword.v, newPassword.v, retypePassword.v])
    useEffect(() => {
        const userId = getUserInfo().id
        //TODO : API to get user details
    }, [location])
    return (
        <Container className="Profile">
            {/*--------------------Profile header------------------------*/}
            <Segment clearing basic className='review-header profile-header'>
                <Header as='h2' floated='left'>
                    My Profile
                </Header>
                {isProfileEdit ?
                    <div>
                        <Button floated='right' basic color='violet' icon='edit' content='Save'
                                active={false}
                                labelPosition='left'
                                onClick={handleProfileSave}
                        />
                        <Button floated='right' basic color='grey' icon='edit' content='Cancel'
                                active={false}
                                labelPosition='left'
                                onClick={handleCancel}
                        />
                    </div>
                    :
                    <Button floated='right' basic color='violet' icon='edit' content='Edit'
                            active={false}
                            labelPosition='left'
                            onClick={() => setIsProfileEdit(true)}
                    />
                }
            </Segment>
            <Divider fitted/>
            <Container className='profile-container'>

                {/*---------------------------Profile image------------------------------*/}

                <Grid columns={2} stackable textAlign='center' className='profile-grid'>
                    <Grid.Column width={3} verticalAlign='middle'>
                        <Reveal animated='fade'>
                            <Reveal.Content visible className={isProfileEdit ? 'show' : 'hide'}>
                                <Image circular src={images.upload} size='small' onClick={handleUpload}/>
                            </Reveal.Content>
                            <Reveal.Content hidden>
                                <Image circular src={user.url === '' ? images.no_profile : user.url} size='small'/>
                            </Reveal.Content>
                        </Reveal>
                    </Grid.Column>

                    {/*---------------------------user details-------------------------------*/}

                    <Grid.Column width={8} verticalAlign='middle'>
                        <Grid columns={2} textAlign='center' className='profile-details'>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>Email:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>

                                    <Input fluid placeholder='Email' value={user.email} disabled
                                           className='profile-input'/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>First Name:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>
                                    <Input fluid placeholder='First Name' className='profile-input'
                                           value={isProfileEdit ? newUser.firstName : user.firstName}
                                           disabled={!isProfileEdit}
                                           onChange={handleFirstName}
                                           error={err.firstName}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>Last Name:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>
                                    <Input fluid placeholder='Last Name' className='profile-input'
                                           value={isProfileEdit ? newUser.lastName : user.lastName}
                                           disabled={!isProfileEdit}
                                           onChange={handleLastName}
                                           error={err.lastName}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>Mobile:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>
                                    <Input fluid placeholder='Mobile' className='profile-input'
                                           value={isProfileEdit ? newUser.mobile : user.mobile}
                                           disabled={!isProfileEdit}
                                           onChange={handleMobile}
                                           error={err.mobile}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Container>
            <Container className='banned-user-container'>
                <Grid columns={2} divided centered stackable>
                    <Grid.Column width={7}>
                        <Header icon as='h1' textAlign='center'>
                        </Header>
                        <Segment basic>
                            <Banned/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={7} verticalAlign={'middle'} className='change-password-form'>
                        <Container>
                            <Header icon as='h1' textAlign='center'>
                                Change password
                            </Header>
                            <Form size='large'
                                  onSubmit={handleSubmit}
                                  warning={submit.formError}
                                  error={submit.loginError}
                                  success={submit.success}
                            >
                                <Message
                                    className={(submit.formError || submit.loginError || submit.success) ?
                                        'message-space-hide' : 'message-space-show'}
                                    header='handle space'
                                />
                                <Message
                                    warning
                                    header='Please give a valid input!'
                                />
                                <Message
                                    error
                                    header='Failed to Register!'
                                />
                                <Message
                                    success
                                    header='Register Success'
                                />
                                <Form.Input placeholder='Old password' type='password' name='password' size='mini'
                                            value={oldPassword.v}
                                            onChange={(e, {value}) => setOldPassword({v: value, e: false})}
                                            error={oldPassword.e}

                                />
                                <Form.Input placeholder='New password' type='password' name='password' size='mini'
                                            value={newPassword.v}
                                            onChange={(e, {value}) => setNewPassword({v: value, e: false})}
                                            error={newPassword.e}
                                />
                                <Form.Input placeholder='Retype new password' type='password' name='password'
                                            size='mini'
                                            value={retypePassword.v}
                                            onChange={handlePasswordMatch}
                                            error={retypePassword.e}
                                />
                                <Form.Button fluid size='large'>Submit</Form.Button>
                            </Form>
                        </Container>
                    </Grid.Column>
                </Grid>
            </Container>
        </Container>
    );
}


export default Profile;
