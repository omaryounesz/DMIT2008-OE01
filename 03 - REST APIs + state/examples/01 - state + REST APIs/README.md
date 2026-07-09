# React, Rest and State

# Why?

Interaction with the backend is really important, and you do that via a rest api. The backend is where you'll be storing all of the information and doing process such as notification, creating a search index.


The backend we're going to use today is [DummyJSON's quotes endpoint](https://dummyjson.com/quotes).

We're also going to use a rest api client to observe what's going on in the rest request.

# Steps

1. Open your rest api client and get a random quote, so we can see the payload.
- make a get request to `https://dummyjson.com/quotes/random` as per the documentation.
You'll see that the response body returns something like this.
```json
{
  "id": 533,
  "quote": "My toughest opponent has always been me.",
  "author": "Muhammad Ali"
}
```
2. Navigate in our `rest-fundamentals-example` and run the project.
Notes:
- This project is using [MUI](https://mui.com/) and is using some components, note that you should begin to feel a bit more comfortable navigating this documentation.
- run the project. 
3. We're going to use one stateful variable to change the author and the quote values, it's going to be an object with that contains two strings: `author` and `quote`.
- import the `useState` hook from react.
```js
import {useState} from 'react'
```
- right under where we create `Home` function is declared add the stateful variable as follows (remember we're creating an object with two key value pairs)
```js
  const [quoteData, setQuoteData] = useState({
    quote: "Quote here.",
    author: "Author here"
  })
```
Note: as a review of state, state can contain any type of data structure here we're just using a js object!
- the last step we're going to do is we're going to change the jsx so that when we change the `quoteData` object, its' reflected in the state.
```js
<Typography variant="h5" align="center" color="text.primary" paragraph>
  {quoteData.quote}
</Typography>
<Typography
  component="h1"
  variant="h4"
  align="center"
  color="text.secondary"
  gutterBottom
>
  {quoteData.author}
</Typography>
```

4. Next let's create a click handler function and hook it up to the `onClick` event to the button. The handler will set new values to the quote.
- let's first create the event handler.
```js
  const handleClick = () => {
    setQuoteData({
      quote: "I'm starting to enjoy JavaScript, but don't tell anyone",
      author: "Myself"
    })
  }
```
- then for that function to fire you need to hook it up with the 
```js
<Button
  variant="contained"
  onClick={handleClick}
>
  Get New Quote
</Button>
```
Observe what happens when you click the button, the project 
5. Let's hook up the quote api with our project.
- under the function definition of home create a const that will have the url.
```js
const RANDOM_QUOTE_URL = 'https://dummyjson.com/quotes/random'
```
- change `handleClick` function so that we fetch the url and with the result we use the `setQuoteData` function to change the values.
```js
  const handleClick = () => {
    fetch(RANDOM_QUOTE_URL)
      .then((response)=> {
        return response.json()
      }).then((data)=> {
        setQuoteData({
          quote: data.quote,
          author: data.author
        })
      })
  }
```
Note: you might be thinking "how did we find the `data.q` and `data.a`?", we found this from looking at the documentation and using our REST API client in step 1.

Observe now that we have a project that fetches new quotes whenever we click the "get new quote" button.
