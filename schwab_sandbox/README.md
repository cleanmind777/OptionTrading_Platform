<p align="center">
  <img src="https://github.com/Patch-Code-Prosperity/Schwab-API-Sandbox/assets/31261577/9d260ab5-4086-47e0-bb00-f9f67a361e64" alt="Schwab API Development Sandbox" width=100%>
</p>

## Introduction 📖
This repository provides a mock server for the Schwab API, allowing developers to test their applications without making real API calls. This is particularly useful for development while your app is stuck in "approved-pending"

### Getting Started
If you are just getting started developing your app, or have not yet begun, use [Pythonic Schwab API](https://github.com/Patch-Code-Prosperity/Pythonic-Schwab-API) for a quick start.

## Requirements 🛠️
- Node.js (Download [here](https://nodejs.org/))
- Prism by Stoplight

## Installation 🔧

### Installing Prism
Prism can be installed globally via npm, which requires Node.js to be pre-installed on your system (see above). You can run the following command in your terminal to install Prism:

This command works on Windows, macOS, and Linux as long as npm is available on your system.

```bash
npm install -g @stoplight/prism-cli
```

## Usage 📝

### Starting the Mock Server
To start the mock server for each API product on your local machine, run:
For Market Data API:
```bash
prism mock -h 0.0.0.0 -p 4010 ./market_data_openapi.yaml
```
For Account and Orders API:
```bash
prism mock -h 0.0.0.0 -p 4020 ./account_orders_openapi.yaml
```
You **can** run both at once.

This starts the Prism mock server(s), listening on all network interfaces at port 4010 and/or 4020, and will reply as if it were the Schwab API server (in most cases). This is provided without warranty and **will** become out of date.

### Modifying API Calls
To use the sandbox environment, modify the base URL in your API calls. Examples of different configurations are provided below:

#### Environment Variable
If using an `.env` file:
```
API_BASE_URL=http://localhost:4020
API_MARKET_URL=http://localhost:4010
```

#### Hardcoded Variable
Modify the base URL directly in your code:
```javascript
const baseUrl = "http://localhost:4020";
const marketUrl = "http://localhost:4010";
```

#### Adding a Sandbox Parameter
If you want to toggle between live and sandbox environments dynamically:
```javascript
let baseUrl = isSandbox ? "http://localhost:4020" : "https://api.schwabapi.com";
let marketUrl = isSandbox ? "http://localhost:4010" : "https://api.schwabapi.com";
```

## Contributing 🤝
Contributions to the sandbox are welcome. Make a PR or open an issue.

## Support 💬
If this project has helped you, please give it a star ⭐ 

Know someone else struggling to develop their Schwab app? Send them a link to this repo — it's great for people who are still "approved-pending" and cannot authenticate to the official API if they want to start developing!

## License 📄
This project is licensed under the [MIT License](LICENSE).

### Disclaimer
Schwab-API-Sandbox is an unofficial development tool/aid. It is in no way endorsed by or affiliated with Charles Schwab or any associated organization. Make sure to read and understand the terms of service of the underlying API before using this package. The authors accept no responsibility for any damage that might stem from use of this package. See the LICENSE file for more details.