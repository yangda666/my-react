# my-react

# eslint

通过分析`AST`来检查代码是否有编写错误

# prettier

代码格式化工具

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

<!-- 简化配置
经过上面两步配置后， ESLint 的配置文件大概如下：

 {
  "extends": [
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
其实可以简化一下，直接 extend 一下 plugin:prettier/recommended 即可。

如下：

{
  "extends": ["plugin:prettier/recommended"]
} -->

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
