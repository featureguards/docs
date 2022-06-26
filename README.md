<p align="center">
  <a href="https://www.featureguards.com/docs">
    <img alt="FeatureGuards" src="./logo/logo.png" width="150" />
  </a>
</p>
<h1 align="center">
  FeatureGuards Documentation
</h1>

# Installation

Install docs

```shell
yarn build
```

To deploy example to github pages

```shell
yarn deploy
```

## FAQs

### How can I deploy the docs to a non root path

Add the `pathPrefix` to `gatsby-config.js` in your docs folder

```javascript
module.exports = {
  pathPrefix: `/docs`,
};
```

Run build command

```
yarn workspace example build
```

For more information visit https://www.gatsbyjs.org/docs/path-prefix/
