<p align="center">
  <h1 align="center">MyCampus API</h1>

  <p align="center">
    REST API of MyCampus Application
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#api-spec">API Spec</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

## About The Project

## Getting Started

### Prerequisites

When you're going to contribute or build, you'll need at least:
  - Node.js 18.x
  - PostgreSQL 14.x

### Installation or Configure

```bash
# clone if you don't have the code base
$ git clone git@github.com:dhichii/mycampus-api.git

# install dependencies
$ npm install

# build
$ npm run build
```

After build, copy and configure the `.env.example` file to be `.env` for the main configuration and `.env.test` for the testing purposes. Finally, run the `npm run migrate` to migrate db and `npm start` command to start.

## API Spec
For the API Spec documentation, you can access it [HERE](https://github.com/dhichii/mycampus-api/tree/main/doc).

## Contact

- Adhicitta Masran - <adhicittamasran@gmail.com>

## Contributors

✨ Thanks goes to these wonderful people who speed up the development process: 

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
    <tr>
        <td align="center">
            <a href="https://github.com/dhichii">
                <img src="https://avatars.githubusercontent.com/u/75155775?v=4?s=100" width="100px;" alt=""/>
                <br />
                <sub><b>Adhicitta Masran</b></sub>
            </a>
        </td>
    </tr>
    <tr>
      <td align="center">
        Main Contributor
      </td>
    </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:FINISH -->
