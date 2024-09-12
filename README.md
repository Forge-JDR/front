# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Make sure you have node, unless :

### installs nvm (Node Version Manager)
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`

### download and install Node.js
`nvm install 20`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Docker

You can also launch the app with Docker using the following command:

`docker-compose up`
Build image : 
docker build -t rg.fr-par.scw.cloud/registryforgejdr/frontforgejdr:0.1 -f ./docker/react/Dockerfile --build-arg REACT_APP_URL_BACK="https://backforgejdryr5nsvrg-container-back-forge-jdr.functions.fnc.fr-par.scw.cloud/api" .

Run front : 
docker run -d -p 3000:3000 -e REACT_APP_URL_BACK="https://backforgejdryr5nsvrg-container-back-forge-jdr.functions.fnc.fr-par.scw.cloud/api" rg.fr-par.scw.cloud/registryforgejdr/frontforgejdr:0.1

Déployer le front sur Scaleway : 
scw container container create name=container-front-forge-jdr registry-image=rg.fr-par.scw.cloud/registryforgejdr/frontforgejdr:0.2 min-scale=1 max-scale=1 memory-limit=128 cpu-limit=70 timeout=300s namespace-id=940522cc-2a4a-4ead-86a0-a37225e447c3 max-concurrency=1 protocol=unknown_protocol sandbox=v1 privacy=public port=3000 environment-variables.REACT_APP_URL_BACK="https://backforgejdryr5nsvrg-container-back-forge-jdr.functions.fnc.fr-par.scw.cloud/api"

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



