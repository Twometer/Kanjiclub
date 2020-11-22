# Kanjiclub backend
REST API backend using node.js and Express

## Setup

Prerequisites:

- Node.js 14
- MongoDB



Install dependencies by running

```
$ npm install
```

Then, configure the backend in `./conf/kanjiclub.json` by setting

- The CORS origin
- Session secret
- The `secure` flag for sessions
- Your MongoDB URL

More languages can be added to the languages.json file in the same folder.

Finally, start the backend using

```
$ npm start
```

or

```
$ node src/app.js
```





### Requirements
- NodeJS 14
- MongoDB