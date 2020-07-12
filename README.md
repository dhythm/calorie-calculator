```
git init
touch README.md .gitignore
npm init -y
npm i react react-dom
npm i -D @babel/core @babel/cli @babel/preset-env @babel/preset-react\ntouch .babelrc
npm i -D webpack webpack-cli webpack-dev-server style-loader css-loader babel-loader\ntouch webpack.config.js
npm i -D typescript ts-loader typesync\nnpx tsc --init
npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-loader\nnpx eslint --init
touch .prettierrc\nnpm i -D husky lint-staged concurrently\nnpm install
mkdir public src\ntouch public/index.html\ntouch src/{index,App}.tsx
npm install
```