# AI Assistant with Command Execution

An interactive AI assistant powered by OpenAI that can execute system commands and help solve various tasks through a conversational interface.

## Features

- 🤖 Interactive terminal-based AI assistant
- 🛠️ Command execution capabilities
- 🔄 Continuous conversation loop
- 🧠 Think-Action-Observe workflow
- 📝 JSON-structured responses

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd build-your-own-curser-ai
   ```

2. **Install dependencies**
   ```bash
   npm install openai
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

4. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy and paste it in your `.env` file

## Usage

1. **Start the assistant**
   ```bash
   node index.js
   ```

2. **Interact with the AI**
   - Enter your query when prompted
   - The AI will think through the problem and execute commands if needed
   - Choose to continue with another query or exit

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
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License