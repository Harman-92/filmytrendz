import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../style/SignUp.css';
import {Button, Container, Divider, Form, Grid, Image, Message, Segment} from "semantic-ui-react";
import {useHistory} from 'react-router-dom';
import {setAccessToken, setUserInfo} from "../config/session";
import api from "../config/axios";
import response from "../config/response";

const Login = ({setVisible}) => {
    const history = useHistory()
    const [email, setEmail] = useState({
        v: '',
        e: false
    })
    const [password, setPassword] = useState({
        v: '',
        e: false
    })
    const [submit, setSubmit] = useState({
        formError: false,
        loginError: false,
        success: false
    })
    const handleEmail = (e, {value}) => {
        const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (pattern.test(value) || value === "") {
            setEmail({
                v: value,
                e: false
            })
        } else {
            setEmail({
                v: value,
                e: true
            })
        }
    }
    const handleSubmit = () => {
        if (email.e || email.v === "" || password.v === "") {
            if (email.v === "") {
                setEmail({
                    v: '',
                    e: true
                })
            }
            if (password.v === "") {
                setPassword({
                    v: '',
                    e: true
                })
            }
            setSubmit({
                formError: true,
                loginError: false,
                success: false
            })

        }else{

            api.post('/login',{
                email: email.v,
                password: password.v
            }).then((res)=>{
                if(res.status === 200) {
                    if(res.data.error){
                        setSubmit({
                            formError: false,
                            loginError: res.data.error,
                            success: false
                        })
                    }else {
                        setSubmit({
                            formError: false,
                            loginError: false,
                            success: true
                        })
                        const data = res.data
                        const userInfo = data.user_info
                        setTimeout(function () {
                            setVisible(false)
                            setAccessToken(data.token)
                            setUserInfo(userInfo.id, userInfo.first_name + ' ' + userInfo.last_name, userInfo.url)
                            history.go(0)
                        }, 500);
                    }
                }else{
                    setSubmit({
                        formError: false,
                        loginError: response.LOGIN_ERROR,
                        success: false
                    })
                }
            }).catch(()=>{
                setSubmit({
                    formError: false,
                    loginError: response.SERVER_UNAVAILABLE,
                    success: false
                })
            })
        }

    }
    useEffect(() => {
        setSubmit({
            formError: false,
            loginError: false,
            success: false
        })
    }, [email.v, password.v])
    return (
        <Container>
            <Grid padded className='form-container'>
                <Grid.Column>
                    <Segment basic className='about-segment'>
                        <Image src='/logo_icon.png' size='tiny'/>
                        <Image src='/logo_text.png' size='small'/>
                    </Segment>
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
                            header={submit.loginError}
                        />
                        <Message
                            success
                            header='Login Success'
                        />
                        <Form.Input fluid icon='user' iconPosition='left'
                                    placeholder='Email address'
                                    value={email.v}
                                    onChange={handleEmail}
                                    error={email.e}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            value={password.v}
                            onChange={(e, {value}) => setPassword({v: value, e: false})}
                            error={password.e}
                        />
                        <Button fluid size='large' color='violet'>
                            Login
                        </Button>
                    </Form>
                </Grid.Column>
            </Grid>
            <Divider/>
        </Container>
    );
}

Login.propTypes = {
    setVisible: PropTypes.func.isRequired
}

export default Login;
