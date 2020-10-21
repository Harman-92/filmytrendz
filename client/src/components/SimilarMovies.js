import React, {Component} from 'react';

import '../style/SimilarMovies.css';
import {Card, Image} from "semantic-ui-react";

export default class SimilarMovies extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className='contentContainer'>
            <Card.Group itemsPerRow={6}>
                {this.props.recommendations.map((movie,index) => {
                        if (index < 6) {
                            return (
                                <Card key={index} centered={true}>
                                    <Image src={movie.image}/>
                                    <Card.Description textAlign='center'>{movie.title}</Card.Description>
                                </Card>
                            )
                        }
                    }
                )}
            </Card.Group>
        </div>
        )
    }
}



