import React, {useEffect, useState} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
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
    Message,
    Segment,
    List, Reveal, Image
} from 'semantic-ui-react';
import '../style/SignUp.css';
import {isAuthenticated, setUserInfo} from "../config/session";
import api from "../config/axios";
import response from "../config/response";
import Avatar from "./Avatar";
import images from "../config/images";

const Profile = () => {
    const history = useHistory()
    const location = useLocation()
    const isLogin = isAuthenticated()
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        mobile_no: '',
    })
    const [newUser, setNewUser] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile_no: user.mobile_no,
        url: user.url
    })
    const [err, setErr] = useState({
        first_name: false,
        last_name: false,
        mobile_no: false
    })
    const [isProfileEdit, setIsProfileEdit] = useState(false)
    const [oldPassword, setOldPassword] = useState({v: '', e: false});
    const [newPassword, setNewPassword] = useState({v: '', e: false});
    const [retypePassword, setRetypePassword] = useState({v: '', e: false});
    const [submit, setSubmit] = useState({
        formError: false,
        passwordError: false,
        success: false
    });
    const [editForm, setEditForm] = useState({
        formError: false,
        editError: false,
        success: false
    });
    const [isActive, setIsActive] = useState(false);
    const [bannedUsers, setBannedUsers] = useState([])
    const [isBannedUserEdit, setIsBannedUserEdit] = useState(false)

    const handleProfileSave = () => {
        if (err.first_name || err.last_name || err.mobile_no || newUser.first_name === "" || newUser.last_name === "") {
            if (newUser.first_name === "") {
                setErr({
                    ...err,
                    first_name: true
                })
            }
            if (newUser.last_name === "") {

                setErr({
                    ...err,
                    last_name: true
                })
            }
            setEditForm({
                formError: true,
                editError: false,
                success: false
            })
        } else {
            api.post('/user', newUser).then((res) => {
                if (res.status === 200) {
                    setUserInfo(user.id,newUser.first_name+' '+newUser.last_name, user.url)
                    setUser({
                        ...user,
                        first_name: newUser.first_name,
                        last_name: newUser.last_name,
                        mobile_no: newUser.mobile_no
                    })
                    setIsProfileEdit(false)
                    setEditForm({
                        formError: false,
                        editError: false,
                        success: true
                    })
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                    setEditForm({
                        formError: false,
                        editError: response.SERVER_ERROR,
                        success: false
                    })
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
                setEditForm({
                    formError: false,
                    editError: response.SERVER_UNAVAILABLE,
                    success: false
                })
            })
        }
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
                passwordError: false,
                success: false
            })
        } else {
            api.post('/user/password', {
                old_password: oldPassword.v,
                new_password: newPassword.v
            }).then((res) => {
                if (res.status === 200) {
                    if(res.data.error){
                        setSubmit({
                            formError: false,
                            passwordError: res.data.error,
                            success: false
                        })
                    } else {
                        setSubmit({
                            formError: false,
                            passwordError: false,
                            success: true
                        })
                    }
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    setSubmit({
                        formError: false,
                        passwordError: response.SERVER_ERROR,
                        success: false
                    })
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                setSubmit({
                    formError: false,
                    passwordError: response.SERVER_UNAVAILABLE,
                    success: false
                })
                console.log(response.SERVER_UNAVAILABLE)
            })
        }
    }
    const handleCancel = () => {
        setIsProfileEdit(false)
        setEditForm({
            formError: false,
            editError: false,
            success: false
        })
        setErr({
            first_name: false,
            last_name: false,
            mobile_no: false
        })
        setNewUser({
            first_name: user.first_name,
            last_name: user.last_name,
            mobile_no: user.mobile_no
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
            alert('upload image not available')
        }
    }
    const handleFirstName = (e, {value}) => {

        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        setNewUser({
            ...newUser,
            first_name: value
        })
        if (pattern.test(value) || value === "") {
            setErr({
                ...err,
                first_name: false
            })
        } else {
            setErr({
                ...err,
                first_name: true
            })
        }
    }
    const handleLastName = (e, {value}) => {

        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        setNewUser({
            ...newUser,
            last_name: value
        })
        if (pattern.test(value) || value === "") {
            setErr({
                ...err,
                last_name: false
            })
        } else {
            setErr({
                ...err,
                last_name: true
            })
        }
    }
    const handleMobile = (e, {value}) => {
        const pattern = new RegExp(/^[0-9]+$/)
        setNewUser({
            ...newUser,
            mobile_no: value
        })
        if ((pattern.test(value) && value.length === 10) || value === ""){
            setErr({
                ...err,
                mobile_no: false
            })
        } else {
            setErr({
                ...err,
                mobile_no: true
            })
        }
    }
    const handleGetBannedUsers = () => {
        if (!isActive) {
            api.get('/user/banneduser').then((res) => {
                if (res.status === 200) {
                    setBannedUsers(res.data.banned_users)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        }
        setIsActive(!isActive)
    }
    const handleUnBanUser = (e, {id}) => {
        api.delete('/user/banneduser/'+id).then((res) => {
            if (res.status === 200) {
                setBannedUsers(users => users.filter(user => user.id !== id))
            } else if(res.status === 401){
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch(() => {
            console.log(response.SERVER_UNAVAILABLE)
        })
    }
    const handleClickEdit = () => {
        setIsProfileEdit(true)
        setEditForm({
            formError: false,
            editError: false,
            success: false
        })
        setNewUser(user)
    }

    useEffect(() => {
        setSubmit({
            formError: false,
            passwordError: false,
            success: false
        })
    }, [oldPassword.v, newPassword.v, retypePassword.v])
    useEffect(() => {
        if (isLogin) {
            api.get('/user').then((res) => {
                if (res.status === 200) {
                    setUser(res.data)
                } else if(res.status === 401){
                    history.push('/')
                } else {
                    console.log(response.SERVER_ERROR)
                }
            }).catch(() => {
                console.log(response.SERVER_UNAVAILABLE)
            })
        } else {
            history.push('/')
        }
    }, [location, history, isLogin])
    return (
        <Container className="Profile">

            {/*--------------------Profile header------------------------*/}

            <Segment clearing basic className='review-header profile-header'>
                <Header as='h2' floated='left'>
                    My Profile
                </Header>
                {isProfileEdit ?
                    <div>
                        <Button floated='right' basic color='violet' icon='save' content='Save'
                                active={false}
                                labelPosition='left'
                                onClick={handleProfileSave}
                        />
                        <Button floated='right' basic color='grey' icon='cancel' content='Cancel'
                                active={false}
                                labelPosition='left'
                                onClick={handleCancel}
                        />
                    </div>
                    :
                    <Button floated='right' basic color='violet' icon='edit' content='Edit'
                            active={false}
                            labelPosition='left'
                            onClick={handleClickEdit}
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
                                {user.url === '' ?
                                    <Avatar user={user.first_name} size='small'/>
                                    :
                                    <Image circular src={user.url} size='small'/>
                                }
                            </Reveal.Content>
                        </Reveal>
                    </Grid.Column>

                    {/*---------------------------user details-------------------------------*/}

                    <Grid.Column as={Form} width={8} verticalAlign='middle'
                                 warning={editForm.formError}
                                 error={editForm.editError}
                                 success={editForm.success}>
                        <Message
                            warning
                            header='Please give a valid input!'
                        />
                        <Message
                            error
                            header={editForm.editError}
                        />
                        <Message
                            success
                            header='User Details Successfully updated'
                        />
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
                                           value={isProfileEdit ? newUser.first_name : user.first_name}
                                           disabled={!isProfileEdit}
                                           onChange={handleFirstName}
                                           error={err.first_name}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>Last Name:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>
                                    <Input fluid placeholder='Last Name' className='profile-input'
                                           value={isProfileEdit ? newUser.last_name : user.last_name}
                                           disabled={!isProfileEdit}
                                           onChange={handleLastName}
                                           error={err.last_name}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
                                    <Header as={'h4'}>Mobile:</Header>
                                </Grid.Column>
                                <Grid.Column width={10} verticalAlign='middle'>
                                    <Input fluid placeholder='Mobile' className='profile-input'
                                           value={isProfileEdit ? newUser.mobile_no : user.mobile_no}
                                           disabled={!isProfileEdit}
                                           onChange={handleMobile}
                                           error={err.mobile_no}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Container>

            {/*----------------------Banned Users--------------------------*/}

            <Container className='banned-user-container'>
                <Grid columns={2} divided centered stackable>
                    <Grid.Column width={8}>
                        <Accordion>
                            <Segment basic className='banned-list-header'>
                                <Accordion.Title
                                    active={isActive}
                                    index={0}
                                    onClick={handleGetBannedUsers}
                                >
                                    <Header icon as='h1' className='banned-list-title'>
                                        <Icon name='dropdown'/>
                                        Blocked Reviewers
                                    </Header>
                                </Accordion.Title>
                                {isActive ?
                                    <Header className='banned-list-edit'>
                                        <Button icon basic size='mini' color='violet'
                                                onClick={() => setIsBannedUserEdit(!isBannedUserEdit)}>
                                            <Icon name='edit'/>
                                        </Button>
                                    </Header>
                                    : null
                                }
                            </Segment>
                            <Divider fitted/>
                            {isActive ?
                                <Accordion.Content active={isActive}>
                                    <Segment basic className='banned-list'>
                                        <List>
                                            {bannedUsers.map((bannedUser, index) => (

                                                <List.Item key={index}>
                                                    {isBannedUserEdit ?
                                                        <List.Icon
                                                            id={bannedUser.id}
                                                            name='trash alternate outline'
                                                            color='red'
                                                            onClick={handleUnBanUser}
                                                        />
                                                        : null}
                                                    <List.Content>
                                                        <h4>{bannedUser.first_name} {bannedUser.last_name}</h4>
                                                    </List.Content>
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Segment>
                                </Accordion.Content>
                                : null
                            }
                        </Accordion>
                    </Grid.Column>

                    {/*---------------------------Change password------------------------------*/}

                    <Grid.Column width={8} verticalAlign={'middle'} className='change-password-form'>
                        <Container>
                            <Segment basic>
                                <Header icon as='h1' textAlign='left'>
                                    Change password
                                </Header>
                            </Segment>
                            <Divider fitted/>
                            <Form size='large'
                                  onSubmit={handleSubmit}
                                  warning={submit.formError}
                                  error={submit.passwordError}
                                  success={submit.success}
                            >
                                <Message
                                    className={(submit.formError || submit.passwordError || submit.success) ?
                                        'message-space-hide' : 'message-space-show'}
                                    header='handle space'
                                />
                                <Message
                                    warning
                                    header='Please give a valid input!'
                                />
                                <Message
                                    error
                                    header={submit.passwordError}
                                />
                                <Message
                                    success
                                    header='Password Successfully changed'
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
