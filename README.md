# my-react

# eslint

ESLint 是一个用于识别和报告 JavaScript 代码中发现的模式的静态代码分析工具。它旨在帮助开发者发现和修复代码中的问题，从而提高代码质量和可维护性。

### ESLint 的主要功能

1. 代码质量检查：ESLint 可以检测代码中的常见错误和不良实践，包括语法错误、代码风格问题和潜在的逻辑错误。
2. 代码风格一致性：通过配置规则，ESLint 可以确保团队中所有开发者遵循相同的编码风格，从而提高代码的一致性。
3. 自动修复：ESLint 提供了一些规则的自动修复功能，可以自动修复部分代码风格问题。
4. 插件和扩展：ESLint 支持插件系统，可以使用第三方插件来扩展其功能，支持更多的规则和自定义检查。
5. 集成性强：ESLint 可以与多种编辑器和集成开发环境（IDE）集成，提供实时的代码检查和反馈。

# prettier

代码格式化工具

### prettier 的主要功能

1. 自动格式化：Prettier 可以自动处理代码格式，使代码符合预设的风格规范。
2. 无争议的代码风格：Prettier 提供了一套固定的规则集，减少了团队中关于代码风格的争议和意见不合。
3. 支持多种语言：不仅支持 JavaScript 和 TypeScript，还支持 CSS、HTML、JSON、Markdown 等多种文件格式。
4. 集成方便：可以与各种编辑器（如 VSCode、Sublime Text）和跨各种开发工具（如 Git hooks、CI/CD）集成。
5. 一致性：通过 Prettier，可以确保团队中的每个开发者的代码风格一致，减轻代码审查的负担。

# eslint-config-prettier

当 ESLint 的规则和 Prettier 的规则相冲突时，就会发现一个尴尬的问题，用其中一种来格式化代码，另一种就会报错。

prettier 官方提供了一款工具 eslint-config-prettier 来解决这个问题。

本质上这个工具其实就是禁用掉了一些不必要的以及和 Prettier 相冲突的 ESLint 规则。

```JSON
  // 在 extends 部分加入 prettier 即可
{
  "extends": [
    "...",
    "prettier"
  ]
}

```

# eslint-plugin-prettier

这个插件的主要作用就是将 prettier 作为 ESLint 的规则来使用，相当于代码不符合 Prettier 的标准时，会报一个 ESLint 错误

```JavaScript
// 修改 eslintrc 文件

{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

# 简化配置

经过上面两步配置后， ESLint 的配置文件大概如下：

```jsx
 {
  "extends": [
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

其实可以简化一下，直接 extend 一下 plugin:prettier/recommended 即可。

如下：

```jsx
{
  "extends": ["plugin:prettier/recommended"]
}
```

# eslint

eslint 8 后实现的扁平化的配置

```javaScript
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["**/*.config.mjs"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": [
        "error"
      ],
    }
  }
];
```
