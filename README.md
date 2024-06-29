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

```
  生活中充满了无常, 无论我们做了多好的准备我们还是上不了山顶,我们就是要接受生活的无常,
```

# React Update

## UpdateQueue 的工作原理

1. 双缓冲结构：
   • UpdateQueue 实际上由两个队列组成：一个当前队列（current queue）和一个正在进行中的队列（work-in-progress queue）。
   • 当前队列表示屏幕的可见状态，而正在进行中的队列可以异步地被处理和修改，在提交前，它们是相互独立的。
   • 如果正在进行中的渲染被丢弃，我们会通过克隆当前队列来创建一个新的正在进行中的队列。
2. 共享的单链表结构：
   • 这两个队列共享一个持久的单链表结构。
   • 每个队列维护一个指向第一个未处理更新的指针。
   • 正在进行中的队列的指针总是等于或大于当前队列的指针，因为我们总是在处理正在进行中的队列。
   • 当前队列的指针只有在提交阶段才会更新。
3. 更新的附加：
   • 为了确保更新不会丢失，我们将更新附加到两个队列的末尾。
   • 这样保证了更新在下一个正在进行中的队列中也会被处理到。

## 优先级和更新处理

1.  更新优先级：
    • 更新不是按优先级排序的，而是按插入顺序排列，新的更新总是附加到列表的末尾。
    • 在渲染阶段处理更新队列时，只有具有足够优先级的更新才会被包含在结果中。
    • 如果由于优先级不足而跳过一个更新，该更新将保留在队列中，以便在较低优先级的渲染过程中处理。
2.  高优先级更新的重基：
    • 被跳过的更新之后的所有更新无论优先级如何都将保留在队列中，这意味着高优先级的更新有时会在两个不同的优先级阶段被处理两次。
    • 我们也会跟踪一个基状态，表示应用队列中第一个更新之前的状态。
3.  处理示例：
    • 假设基状态是 ''，更新队列如下：

            ```s
            A1 - B2 - C1 - D2;
            ```

            • 其中数字表示优先级，更新通过在之前状态后追加字母来应用。

            • 第一轮渲染，优先级 1：

            ```s
            基状态: ''
            更新: [A1, C1]
            结果状态: 'AC'
            ```
            •	第二轮渲染，优先级 2：
            ```
            基状态: 'A'            <- 基状态不包括 C1，因为 B2 被跳过。
            更新: [B2, C1, D2]   <- C1 被重基于 B2 之上。
            结果状态: 'ABCD'
            ```

## 总结

UpdateQueue 通过双缓冲结构和单链表的共享机制，确保了更新操作的顺序处理和不丢失。优先级机制允许在不同优先级下处理更新，最终状态是确定的，不受中间状态的影响。这种设计确保了 React 应用中状态更新的可靠性和一致性。

# React Fiber Tree

## FiberRootNode

在 React 的 Fiber 架构中，FiberRootNode 是一个关键的数据结构，它代表了整个 React 应用的根节点。FiberRootNode 负责管理应用的状态、调度更新和协调渲染。以下是对 FiberRootNode 的详细解释。

### FiberRootNode 的功能:

1. 状态管理：
   • FiberRootNode 管理整个 React 应用的状态，包括当前的 Fiber 树和待处理的更新。
2. 更新调度：
   • 负责调度应用的状态更新，确保高优先级的更新能够优先处理。
3. 协调渲染：
   • 协调和处理整个应用的渲染过程，从根节点开始遍历和更新 Fiber 树。

### FiberRootNode 的结构

FiberRootNode 是一个复杂的对象，它包含多个属性来管理和协调应用的状态和更新。以下是 FiberRootNode 的主要属性：

    •	containerInfo：保存根容器的信息（例如 DOM 元素）。
    •	current：指向当前 Fiber 树的根节点 (即 HostRootFiber).
    •	pendingChildren：指向待处理的子节点列表。
    •	finishedWork：指向已经完成工作的 Fiber 树。
    •	timeoutHandle：用于处理异步更新的定时器。
    •	context 和 pendingContext：用于管理上下文信息。
    •	callbackNode 和 callbackPriority：用于调度更新的回调函数和优先级。

## HostRootFiber

HostRootFiber 是 Fiber 树的根节点，它承担了 React 应用的初始挂载和后续更新的协调工作。其主要功能包括：

1. 初始化挂载：
   • 当 React 应用第一次渲染时，HostRootFiber 负责从根节点开始构建 Fiber 树，并将 React 组件渲染到 DOM 中。
2. 状态管理：
   • 管理 React 应用的全局状态，包括上下文和更新队列。
3. 更新调度：
   • 处理状态更新，并根据优先级调度这些更新，以确保高优先级的更新能及时响应。
4. 渲染协调：
   • 从根节点开始协调 Fiber 树的渲染过程，处理 DOM 的更新和重新渲染。

### HostRootFiber 的结构

HostRootFiber 作为一个 Fiber 节点，包含了一些特定的属性来管理和协调应用的状态和更新。以下是 HostRootFiber 的一些关键属性：

• tag：标识 Fiber 节点的类型，对于 HostRootFiber，其值是 HostRoot。
• stateNode：指向与此 Fiber 节点关联的具体实例，对于 HostRootFiber，它指向 FiberRootNode。
• updateQueue：保存需要处理的更新。
• memoizedState：存储已计算的状态。
• pendingProps 和 memoizedProps：分别存储新的和已计算的属性。

### FiberRootNode 和 HostRootFiber 的关系

1. FiberRootNode 是整个 React 应用的根节点，用于管理应用的状态、调度更新和协调渲染。
2. HostRootFiber 是 Fiber 树的根节点，它挂载在 FiberRootNode 上，并通过 FiberRootNode 的 current 属性指向。
   ![alt text](image-1.png)

### 创建与初始化

在调用 ReactDOM.render 时，React 会创建 FiberRootNode 和 HostRootFiber，并初始化它们的关系。以下是一个简化的过程描述：

1. 创建 FiberRootNode：
   • 当 ReactDOM.render 被调用时，会首先创建一个 FiberRootNode，它包含整个应用的状态和调度信息。
2. 创建 HostRootFiber：
   • 然后创建一个 HostRootFiber，并将其关联到 FiberRootNode 的 current 属性。
3. 挂载与渲染：
   • 接着，React 会从 HostRootFiber 开始构建 Fiber 树，并将组件渲染到 DOM 中。

## 总结

• HostRootFiber 是 Fiber 树的根节点，负责管理和协调应用的初始挂载和后续更新。
• FiberRootNode 管理整个 React 应用的状态和调度信息，而 HostRootFiber 通过 FiberRootNode 的 current 属性指向。
• 创建与初始化 在调用 ReactDOM.render 时完成，React 会创建 FiberRootNode 和 HostRootFiber，并从根节点开始构建和渲染 Fiber 树。

# renconciler

React Reconciler 是 React 库中负责管理虚拟 DOM 更新和高效地将这些更新应用到真实 DOM 的部分。 它的主要任务是处理虚拟 DOM 和真实 DOM 之间的差异,并确保这些差异高效地更新到真实 DOM 中。

## beginWork

## completeWork
