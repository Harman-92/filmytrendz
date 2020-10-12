import React from 'react';
import logo from '../logo.svg';
import '../style/Home.css';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'

function Home() {
  return (
    <div className="App">
        <header className="App-header">
          HOME
        </header>
        <Segment placeholder>
            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column verticalAlign='middle'>
                    <Button content='Sign up' icon='signup' size='big' />
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <Form.Input
                            icon='user'
                            iconPosition='left'
                            label='Username'
                            placeholder='Username'
                        />
                        <Form.Input
                            icon='lock'
                            iconPosition='left'
                            label='Password'
                            type='password'
                        />

                        <Button content='Login' primary />
                    </Form>
                </Grid.Column>
            </Grid>

            <Divider vertical>Or</Divider>
        </Segment>
    </div>
  );
}

export default Home;
