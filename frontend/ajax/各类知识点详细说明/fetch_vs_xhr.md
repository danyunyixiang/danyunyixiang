### Fetch API 与 XMLHttpRequest (XHR) API 对比详解

**1. 简介**

在 Web 开发中，客户端与服务器进行数据交互是核心功能之一。长久以来，`XMLHttpRequest` (XHR) 是实现这一目标的主要技术。然而，随着 Web 技术的发展，`Fetch API` 应运而生，提供了一种更现代、更强大且更灵活的网络请求方式。

本篇文档将详细对比 `Fetch API` 和 `XMLHttpRequest`，帮助你理解它们的核心差异、各自的优缺点以及适用场景。

**2. 核心差异概览**

| 特性              | Fetch API                                                  | XMLHttpRequest (XHR)                                        |
| ----------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| **核心机制**      | 基于 Promise，天然支持 `async/await`                       | 基于事件驱动 (event-based)                                  |
| **API 设计**      | 现代、简洁、易于理解                                       | 相对复杂，配置项分散                                        |
| **请求/响应对象** | 标准的 `Request` 和 `Response` 对象                        | 使用 XHR 自身的属性和方法处理请求和响应                     |
| **错误处理**      | Promise 仅在网络错误时 `reject`，需检查 `response.ok`      | `onerror` 处理网络错误，`onreadystatechange` 检查 HTTP 状态 |
| **数据处理**      | 强大的 `Body` mixin，支持多种数据类型和流                  | 主要处理文本和二进制数据，流处理较弱                        |
| **CORS**          | 配置更直观 (`mode` 选项)                                   | 通过 `withCredentials` 等属性配置                           |
| **Cookies**       | 默认不发送，需明确配置 (`credentials` 选项)                | 同源请求默认发送                                            |
| **中止请求**      | 使用 `AbortController` 和 `AbortSignal`                    | 使用 `abort()` 方法                                         |
| **进度跟踪**      | 下载进度需通过 `ReadableStream` 实现，上传进度原生支持有限 | `onprogress` 事件用于上传和下载进度                         |
| **浏览器支持**    | 现代浏览器标配，旧浏览器可能需 polyfill                    | 兼容性好，支持非常旧的浏览器                                |

**3. 详细对比**

**3.1 核心机制与 API 设计**

- **Fetch API**:

  - 返回一个 `Promise` 对象，这使得异步操作的处理更加优雅，可以方便地使用 `.then()`, `.catch()`, `.finally()` 以及 `async/await` 语法。
  - API 设计遵循关注点分离的原则，请求的配置（URL, 方法,头部, body等）通过一个可选的 `init` 对象传入 `fetch()` 函数。

  ```javascript
  fetch("/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("网络响应错误");
      }
      return response.json(); // response.json() 也返回一个 Promise
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("请求失败:", error));
  ```

- **XMLHttpRequest (XHR)**:

  - 采用事件驱动模型。你需要监听不同的事件（如 `load`, `error`, `progress`, `readystatechange`）来处理异步操作的不同阶段。
  - API 相对冗余，需要按顺序调用多个方法 (`open()`, `send()`) 并设置多个属性 (`onreadystatechange`, `setRequestHeader()`) 来完成一个请求。

  ```javascript
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/data", true); // 第三个参数表示是否异步

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // 请求完成
      if (xhr.status === 200) {
        // HTTP 状态码
        try {
          const data = JSON.parse(xhr.responseText);
          console.log(data);
        } catch (e) {
          console.error("解析响应失败:", e);
        }
      } else {
        console.error("请求错误:", xhr.status, xhr.statusText);
      }
    }
  };

  xhr.onerror = function () {
    console.error("网络请求发生错误");
  };

  xhr.send();
  ```

**3.2 请求 (Request) 和响应 (Response) 对象**

- **Fetch API**:

  - 引入了标准的 `Request` 和 `Response` 接口（以及 `Headers`, `URLSearchParams` 等）。这些对象是可扩展的，并且可以在其他现代 Web API 中使用（例如 Service Workers, Cache API）。
  - `Request` 对象代表一个资源请求。你可以显式创建一个 `Request` 对象，或者 `fetch()` 会隐式为你创建一个。
  - `Response` 对象代表对请求的响应。它提供了访问响应体（通过 `Body` mixin 提供的方法如 `.json()`, `.text()`, `.blob()`, `.arrayBuffer()`, `.formData()`）、状态码 (`response.status`)、状态文本 (`response.statusText`)、头部 (`response.headers`) 等的便捷方法。

- **XMLHttpRequest (XHR)**:
  - 请求信息通过 `open()` 方法的参数和 `setRequestHeader()` 方法设置。
  - 响应信息通过 XHR 对象的属性获取，如 `xhr.responseText`, `xhr.responseXML`, `xhr.status`, `xhr.statusText`, `xhr.getAllResponseHeaders()`。它没有一个统一的"响应对象"的概念。

**3.3 错误处理**

- **Fetch API**:

  - `fetch()` 返回的 Promise **只会在发生网络错误时被 `reject`** (例如，DNS 解析失败、用户离线)。
  - 对于服务器返回的 HTTP 错误状态码（如 404 Not Found, 500 Internal Server Error），`fetch()` 的 Promise **仍然会 `resolve`**。你需要显式检查 `response.ok` (如果状态码在 200-299 范围内则为 `true`) 或 `response.status` 来判断请求是否真的成功。

  ```javascript
  fetch("/api/nonexistent")
    .then((response) => {
      if (!response.ok) {
        // 处理 HTTP 错误
        console.error(`HTTP 错误: ${response.status} ${response.statusText}`);
        if (response.status === 404) {
          return { error: "资源未找到" };
        }
        // 可以选择抛出错误，让 catch 块处理
        throw new Error(`服务器错误: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => {
      // 处理网络错误或上面抛出的错误
      console.error("Fetch 操作失败:", error);
    });
  ```

- **XMLHttpRequest (XHR)**:
  - 网络错误会触发 `onerror` 事件处理器。
  - HTTP 错误状态码（如 404, 500）不会触发 `onerror`。你需要在 `onreadystatechange` 事件处理器中（当 `readyState` 为 4 时）检查 `xhr.status`。
  ```javascript
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/nonexistent");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
      } else {
        // 处理 HTTP 错误
        console.error(`HTTP 错误: ${xhr.status} ${xhr.statusText}`);
      }
    }
  };
  xhr.onerror = function () {
    // 处理网络错误
    console.error("XHR 网络错误");
  };
  xhr.send();
  ```

**3.4 数据处理与流 (Streams)**

- **Fetch API**:

  - `Request` 和 `Response` 对象都使用了 `Body` mixin，它提供了一系列方法来处理请求体和响应体。
    - `arrayBuffer()`: 以 `ArrayBuffer` 形式获取。
    - `blob()`: 以 `Blob` 对象形式获取。
    - `formData()`: 以 `FormData` 对象形式获取。
    - `json()`: 解析为 JSON 对象。
    - `text()`: 解析为 USVString (文本)。
  - `response.body` 是一个 `ReadableStream` 对象。这使得你可以分块读取响应数据，对于处理大文件或实现流式数据显示非常有用。

  ```javascript
  // 发送 JSON 数据
  fetch("/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Fetch User", id: 1 }),
  });

  // 处理流式响应
  fetch("/api/large-file")
    .then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      function readChunk() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            console.log("流读取完毕");
            return;
          }
          console.log("读取到数据块:", decoder.decode(value, { stream: true }));
          return readChunk();
        });
      }
      return readChunk();
    })
    .catch((error) => console.error("流处理错误:", error));
  ```

- **XMLHttpRequest (XHR)**:
  - 发送数据时，`send()` 方法可以接受字符串、`Document`、`FormData`、`Blob`、`ArrayBufferView` 或 `ArrayBuffer`。
  - `xhr.responseType` 属性可以设置为 `"text"`, `"json"`, `"arraybuffer"`, `"blob"`, `"document"` 来指定期望的响应数据格式。
  - 虽然 XHR Level 2 引入了对 `FormData`, `Blob`, `ArrayBuffer` 的支持，但其流处理能力远不如 Fetch API 的 `ReadableStream` 强大和灵活。

**3.5 CORS (跨域资源共享) 和 Cookies**

- **Fetch API**:

  - 对于 CORS 请求，`fetch` 默认不会发送或接收 cookies。
  - 你需要通过 `credentials` 选项来控制 cookies 的发送：
    - `'omit'` (默认): 从不发送 cookies。
    - `'same-origin'`: 仅在 URL 与调用脚本同源时发送 cookies。
    - `'include'`: 始终发送 cookies，即使是跨域请求。
  - `mode` 选项 (`'cors'`, `'no-cors'`, `'same-origin'`, `'navigate'`) 提供了对请求模式的精细控制，影响服务器需要返回哪些 CORS 头部。

- **XMLHttpRequest (XHR)**:
  - 对于同源请求，默认会发送 cookies。
  - 对于跨域请求，你需要设置 `xhr.withCredentials = true;` 才能发送 cookies，并且服务器响应必须包含 `Access-Control-Allow-Credentials: true` 头部。

**3.6 中止请求 (Aborting)**

- **Fetch API**:

  - 使用 `AbortController` 和 `AbortSignal` 机制来中止请求。这是一种更通用和可组合的中止模式，也可以用于中止其他异步操作。

  ```javascript
  const controller = new AbortController();
  const signal = controller.signal;

  fetch("/api/long-request", { signal })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((err) => {
      if (err.name === "AbortError") {
        console.log("Fetch 请求已中止");
      } else {
        console.error("Fetch 错误:", err);
      }
    });

  // 1秒后中止请求
  setTimeout(() => controller.abort(), 1000);
  ```

- **XMLHttpRequest (XHR)**:

  - 直接调用 XHR 实例的 `abort()` 方法。

  ```javascript
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/long-request");
  xhr.onreadystatechange = function () {
    /* ... */
  };
  xhr.send();

  // 1秒后中止请求
  setTimeout(() => xhr.abort(), 1000);
  // 中止会触发 readystatechange 事件，readyState 变为 XMLHttpRequest.DONE (4)，status 为 0
  ```

**3.7 进度跟踪**

- **Fetch API**:

  - 原生对**下载**进度的支持比较间接，需要通过 `response.body` (ReadableStream) 来手动计算。你需要读取流的块，并根据 `Content-Length` 头部（如果可用）来计算进度。
  - 对于**上传**进度，规范中已经有了 `ReadableStream` 作为请求体的支持，一些现代浏览器开始实现，但不如 XHR 成熟。`fetch()` 本身不直接提供上传进度事件。

- **XMLHttpRequest (XHR)**:

  - 提供了 `progress` 事件，可以用于跟踪上传和下载的进度。
  - `xhr.onprogress` (或 `xhr.addEventListener('progress', ...)`): 用于下载进度。
  - `xhr.upload.onprogress` (或 `xhr.upload.addEventListener('progress', ...)`): 用于上传进度。
  - 事件对象包含 `loaded` (已传输的字节数) 和 `total` (总字节数，如果服务器提供了 `Content-Length`) 属性。

  ```javascript
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/upload-file");

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`上传进度: ${percentComplete.toFixed(2)}%`);
    }
  };

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`下载进度: ${percentComplete.toFixed(2)}%`);
    }
  };

  const formData = new FormData();
  // formData.append('file', myFile);
  xhr.send(formData);
  ```

**4. 代码示例对比**

**4.1 发起一个简单的 GET 请求**

- **Fetch API**:

  ```javascript
  async function fetchDataWithFetch() {
    try {
      const response = await fetch("https://api.example.com/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetch Data:", data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }
  fetchDataWithFetch();
  ```

- **XMLHttpRequest**:
  ```javascript
  function fetchDataWithXHR() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.example.com/data", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log("XHR Data:", data);
          } catch (e) {
            console.error("XHR JSON Parse Error:", e);
          }
        } else {
          console.error("XHR Error:", xhr.status, xhr.statusText);
        }
      }
    };
    xhr.onerror = function () {
      console.error("XHR Network Error.");
    };
    xhr.send();
  }
  fetchDataWithXHR();
  ```

**4.2 发起一个 POST 请求 (发送 JSON)**

- **Fetch API**:

  ```javascript
  async function postDataWithFetch() {
    const payload = { name: "Test", value: 123 };
    try {
      const response = await fetch("https://api.example.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetch POST Response:", data);
    } catch (error) {
      console.error("Fetch POST Error:", error);
    }
  }
  postDataWithFetch();
  ```

- **XMLHttpRequest**:

  ```javascript
  function postDataWithXHR() {
    const payload = { name: "Test", value: 123 };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.example.com/submit", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          // 201 Created
          try {
            const data = JSON.parse(xhr.responseText);
            console.log("XHR POST Response:", data);
          } catch (e) {
            console.error("XHR POST JSON Parse Error:", e);
          }
        } else {
          console.error("XHR POST Error:", xhr.status, xhr.statusText);
        }
      }
    };
    xhr.onerror = function () {
      console.error("XHR POST Network Error.");
    };
    xhr.send(JSON.stringify(payload));
  }
  postDataWithXHR();
  ```

**5. 何时选择？**

- **优先选择 `Fetch API`**:

  - 对于所有**新项目**，`Fetch API` 通常是更好的选择，因为它基于 Promise，API 更简洁，与现代 JavaScript 特性（如 `async/await`）结合得更好。
  - 当需要处理流式数据（`ReadableStream`）时。
  - 当需要更灵活的请求和响应对象操作时。
  - Service Workers 内部强制使用 `Fetch API`。

- **可能需要使用 `XMLHttpRequest` 的情况**:
  - 需要兼容非常古老的浏览器（`fetch` 可以通过 polyfill 解决大部分情况）。
  - 需要精细的、原生的**上传进度**事件，并且目标浏览器对 `fetch` 上传流的支持不完善时。XHR 在这方面有更成熟和广泛的支持。
  - 在一些特定场景下，例如需要同步 XHR 请求（尽管强烈不推荐，因为它会阻塞主线程）。Fetch API 不支持同步请求。
  - 处理 XML 文档且 `responseXML` 特性非常方便时（尽管 `fetch` 也可以获取文本然后手动解析）。

**6. 总结**

`Fetch API` 代表了现代 Web 中进行网络请求的未来。其基于 Promise 的设计、强大的功能集（如对流、`Request`/`Response` 对象的支持）以及更简洁的 API，使其成为大多数 Web 开发场景下的首选。

虽然 `XMLHttpRequest` 仍然有其用武之地，特别是在需要旧浏览器兼容性或特定原生进度事件的场景下，但新项目中应尽可能拥抱 `Fetch API`。理解两者之间的差异有助于开发者根据项目需求做出明智的技术选型。
