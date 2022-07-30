export const langDisplayName = (lang) => {
  switch (lang) {
    case "python":
      return "Python";
    case "go":
      return "Go";
    case "javascript":
      return "Javascript";
    case "typescript":
      return "Typescript/ES6";
    case "javascript-nodejs":
      return "Javascript (NodeJS)";
    case "javascript-browser":
      return "Javascript (Browser)";
    default:
      throw new Error(`unsupported language ${lang}`);
  }
};
