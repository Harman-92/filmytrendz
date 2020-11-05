import React, {useEffect, useState} from 'react';
import '../style/SignUp.css';
import {Button, Container, Divider, Form, Grid, Message} from "semantic-ui-react";
import {useHistory} from 'react-router-dom';
import {setAccessToken, setUserInfo} from "../config/session";
import api,{setClientToken} from "../config/axios";

const Login = (props) => {
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
                    const data = res.data
                    const userInfo = data.user_info
                    setEmail({...email,v:''})
                    setPassword({...password,v:''})
                    setSubmit({
                        formError: false,
                        loginError: false,
                        success: true
                    })
                    setTimeout(function () {
                        props.setVisible(false)
                        setClientToken(data.token)
                        setAccessToken(data.token)
                        setUserInfo(userInfo.id, userInfo.first_name+' '+userInfo.last_name, userInfo.url)
                        history.push('/')
                    }, 500);
                }else{
                    setSubmit({
                        formError: false,
                        loginError: true,
                        success: false
                    })
                }
            }).catch((e)=>{
                setSubmit({
                    formError: false,
                    loginError: true,
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
                            header='Invalid email or password!'
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
export default Login;
