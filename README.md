# AI Assistant with Command Execution

An interactive AI assistant powered by OpenAI that can execute system commands and help solve various tasks through a conversational interface.

## Features

- 🤖 Interactive terminal-based AI assistant
- 🛠️ Command execution capabilities
- 🔄 Continuous conversation loop
- 🧠 Think-Action-Observe workflow
- 📝 JSON-structured responses

## Prerequisites

- Node.js (v20.19.1 or higher)
- npm or yarn
- OpenAI API key

## Setup

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd build-your-own-curser-ai
   ```

2. **Use correct Node.js version (if using nvm)**

   ```bash
   nvm use
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Setup environment variables**

   ```bash
   npm run setup
   ```

5. **Configure your API key**
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Get OpenAI API Key

- Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy and paste it in your `.env` file

## Usage

### Production Mode

```bash
npm start
```

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Interaction

- Enter your query when prompted
- The AI will think through the problem and execute commands if needed
- Choose to continue with another query or exit

## Available Scripts

- `npm start` - Run the assistant in production mode
- `npm run dev` - Run with auto-restart on file changes
- `npm run setup` - Quick setup of environment variables
- `npm test` - Run tests (not implemented yet)

## How It Works

The AI assistant follows a structured workflow:

1. **START** - User provides a query
2. **THINK** - AI analyzes the problem
3. **ACTION** - Executes tools/commands if needed
4. **OBSERVE** - Reviews command output
5. **OUTPUT** - Provides final response

## Available Tools

- `executeCommand(command)` - Executes Linux/Unix commands on your system

## Example Queries

- "Create a simple HTML file"
- "Check system information"
- "List files in current directory"
- "Install a package using npm"

## Security Note

⚠️ **Warning**: This assistant can execute system commands. Only use with trusted queries and review commands before execution.

## File Structure

```
├── index.js          # Main application
├── package.json      # Node.js dependencies and scripts
├── .nvmrc           # Node.js version specification
├── .env.example     # Environment variables template
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## Node.js Version Management

This project uses Node.js v18.17.0. If you're using nvm:

```bash
# Install and use the specified Node.js version
nvm install
nvm use

# Verify version
node --version
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
