import {Header} from "semantic-ui-react";
import React from "react";

const genres = [
    {key: 0, text: 'Action', value: 'Action', content:(<Header className='itemFont' subheader='Action'/>)},
    {key: 1, text: 'Adventure', value: 'Adventure', content:(<Header className='itemFont' subheader='Adventure'/>)},
    {key: 2, text: 'Comedy', value: 'Comedy', content:(<Header className='itemFont' subheader='Comedy'/>)},
    {key: 3, text: 'Crime', value: 'Crime', content:(<Header className='itemFont' subheader='Crime'/>)},
    {key: 4, text: 'Drama', value: 'Crime', content:(<Header className='itemFont' subheader='Drama'/>)},
    {key: 5, text: 'Fantasy', value: 'Fantasy', content:(<Header className='itemFont' subheader='Fantasy'/>)},
    {key: 6, text: 'Historical', value: 'Historical', content:(<Header className='itemFont' subheader='Historical'/>)}
]

export default genres
