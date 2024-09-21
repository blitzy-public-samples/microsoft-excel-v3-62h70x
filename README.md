# Microsoft Excel

[![Build Status](https://img.shields.io/travis/microsoft/excel/main.svg)](https://travis-ci.org/microsoft/excel)
[![Test Coverage](https://img.shields.io/codecov/c/github/microsoft/excel/main.svg)](https://codecov.io/gh/microsoft/excel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview
This repository contains the source code for the Microsoft Excel application, a comprehensive spreadsheet software that provides powerful data management, analysis, and visualization capabilities.

## Features
- Create and edit workbooks with multiple worksheets
- Perform complex calculations using a wide range of built-in functions
- Create charts and graphs for data visualization
- Collaborate in real-time with other users
- Available on desktop (Windows, macOS), web, and mobile (iOS, Android) platforms

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/microsoft/excel.git
   cd excel
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Run the application:
   ```
   npm run dev
   ```

## Testing
Run the test suite with:
```
npm test
```

## Deployment
Refer to the `deployment.md` file for detailed deployment instructions.

## Architecture and Design
The Microsoft Excel application follows a microservices architecture, with separate services for workbook management, real-time collaboration, and data processing. The frontend is built using React, while the backend uses Node.js with Express. Data is stored in MongoDB, and Redis is used for caching and real-time updates.

For more detailed information about the project's architecture, please refer to the `ARCHITECTURE.md` file.

## Troubleshooting
Common issues and their solutions:

1. **MongoDB connection error**: Ensure MongoDB is running and the connection string in `.env` is correct.
2. **npm install fails**: Try clearing the npm cache with `npm cache clean --force` and retry.
3. **Real-time updates not working**: Check Redis connection and ensure WebSocket server is running.

For more troubleshooting tips, see the `TROUBLESHOOTING.md` file.

## Documentation
- [API Documentation](https://docs.microsoft.com/en-us/excel/api)
- [User Guide](https://support.microsoft.com/en-us/excel)
- [Developer Guide](https://docs.microsoft.com/en-us/office/dev/add-ins/excel/)

## Roadmap and Future Plans
Our upcoming features and improvements include:
- Enhanced machine learning capabilities for data analysis
- Improved real-time collaboration features
- Better integration with other Microsoft 365 products
- Performance optimizations for large datasets

See our [project board](https://github.com/microsoft/excel/projects) for more details on upcoming features and current progress.

## Contributing
Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## Reporting Issues
If you encounter any bugs or have feature requests, please file an issue on our [GitHub Issues page](https://github.com/microsoft/excel/issues). When reporting a bug, please include:
- A clear, descriptive title
- A detailed description of the issue
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Your environment (OS, browser, etc.)

## Support and Community
For general support and discussions, join our [community forum](https://techcommunity.microsoft.com/t5/excel/bd-p/Excel_Cat).

For official support, please visit [Microsoft Support](https://support.microsoft.com/en-us/excel).

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments
- Thanks to all the contributors who have helped shape Microsoft Excel
- Special thanks to the open-source community for their invaluable tools and libraries