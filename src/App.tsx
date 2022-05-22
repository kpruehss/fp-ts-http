import React, {useEffect} from 'react';
import './App.css';
import * as io from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import {pipe} from "fp-ts/function";

const post = io.type({
  userId: io.number,
  id: io.number,
  body: io.string,
  title: io.string
})

const posts = io.array(post)

const httpGet = (url: string) => TE.tryCatch<Error, Response>(
  () => fetch(url).then(r => r.json()),
  reason => new Error(String(reason))
)

const getPosts = pipe(
  httpGet('https://jsonplaceholder.typecode.com/posts'),
  TE.map(x => x),
  TE.chain((payload) => pipe(
    posts.decode(payload),
    E.mapLeft(err => new Error(String(err))),
    TE.fromEither,
  )),
  TE.bimap(
    e => console.error('BOOM: ', e),
    () => console.log)
)

function App() {
  useEffect(
    () => {
      getPosts()
    }, []
  )
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo"/>*/}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    // <TaskEitherExample/>
  );
}

export default App;
