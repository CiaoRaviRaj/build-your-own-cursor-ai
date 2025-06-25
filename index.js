// index.js

// 1. --- IMPORTS ---
// Import the OpenAI library to interact with the API.
import OpenAI from "openai";
// Import the `exec` function from Node.js's child_process module to run shell commands.
import { exec } from "node:child_process";
// Import `promisify` to convert the callback-based `exec` into a Promise-based function.
import { promisify } from "node:util";
// Import readline for terminal input
import readline from "node:readline";

// 2. --- SETUP ---
// Promisify the exec function so we can use it with async/await for cleaner code.
const execPromise = promisify(exec);

// Get OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY environment variable is not set.");
  console.log("Please set your OpenAI API key in the .env file or as an environment variable.");
  process.exit(1);
}

// Create a new instance of the OpenAI client.
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// 3. --- AVAILABLE TOOLS ---
// This is the function that the AI can decide to call. It executes any shell command.
async function executeCommand(command) {
  console.log(`\n🤖 Tool Call: executeCommand: (${command})`);
  try {
    // Await the promise-based exec function.
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    // Return the standard output and standard error to the AI.
    return `stdout: ${stdout}\nstderr: ${stderr}`;
  } catch (error) {
    console.error(`exec error: ${error}`);
    return `Error executing command: ${error.message}`;
  }
}

// This map connects the tool names (as strings) to the actual JavaScript functions.
// The AI will use the string name, and we'll use this map to find and run the real function.
const TOOLS_MAP = {
  executeCommand: executeCommand,
};

// 4. --- THE SYSTEM PROMPT ---
// This is the core instruction set for our AI agent. It defines its persona, capabilities, rules, and workflow.
const SYSTEM_PROMPT = `
You are an helpfull AI Assistant who is designed to resolve user query.
You work on START, THINK, ACTION, OBSERVE and OUTPUT Mode.

In the start phase, user gives a query to you.
Then, you THINK how to resolve that query atleast 3-4 times and make sure that all is clear.
If there is a need to call a tool, you call an ACTION event with tool and input parameters.
If there is an action call, wait for the OBSERVE that is output of the tool.
Based on the OBSERVE from prev step, you either output or repeat the loop.

Rules:
- Always wait for next step.
- Always output a single step and wait for the next step.
- Output must be strictly JSON
- Only call tool action from Available tools only.
- Strictly follow the output format in JSON

Available Tools:
- executeCommand(command): string Executes a given linux command on user's device and returns the STDOUT and STDERR

Example:
START: What is weather of Patiala?
THINK: The user is asking for the weather of Patiala.
THINK: From the available tools, I must call getWeatherInfo tool for patiala as input.
ACTION: Call Tool getWeatherInfo(patiala)
OBSERVE: 32 Degree C
THINK: The output of getWeatherInfo for patiala is 32 Degree C
OUTPUT: Hey, The weather of Patiala is 32 Degree C which is quite hot 🥵

Output Example:
{ "role": "user", "content": "What is weather of Patiala?" }
{ "step": "think", "content": "The user is asking for the weather of Patiala." }
{ "step": "think", "content": "From the available tools, I must call getWeatherInfo tool for patiala as input." }
{ "step": "action", "tool": "getWeatherInfo", "input": "Patiala" }
{ "step": "observe", "content": "32 Degree C" }
{ "step": "think", "content": "The output of getWeatherInfo for patiala is 32 Degree C" }
{ "step": "output", "content": "Hey, The weather of Patiala is 32 Degree C which is quite hot 🥵" }

Output Format:
{ "step": "string", "tool": "string", "input": "string", "content": "string" }
`;

// 5. --- TERMINAL INPUT HELPER ---
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// 6. --- PROCESS SINGLE QUERY ---
async function processQuery(userQuery) {
  // Initialize the conversation history with the system prompt.
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  // Add the user's query to the message history.
  messages.push({ role: "user", content: userQuery });
  console.log(`\n👤 User: ${userQuery}\n`);

  // The main loop where the AI reasons and acts.
  while (true) {
    // Get the AI's next step.
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Or 'gpt-4-turbo'
      response_format: { type: "json_object" },
      messages: messages,
    });

    const aiResponseContent = response.choices[0].message.content;

    // Add the AI's response to our history to maintain context.
    messages.push({
      role: "assistant",
      content: aiResponseContent,
    });

    // Parse the AI's JSON response.
    let parsed_response;
    try {
      parsed_response = JSON.parse(aiResponseContent);
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        aiResponseContent,
        "\nError:",
        e
      );
      break; // Exit the loop if parsing fails.
    }

    // --- The Orchestrator ---
    // Decide what to do based on the AI's chosen step.
    if (parsed_response.step) {
      if (parsed_response.step === "think") {
        console.log(`\n🧠 Thinking: ${parsed_response.content}`);
        continue; // Go to the next loop iteration to let the AI think again or act.
      }

      if (parsed_response.step === "output") {
        console.log(`\n✅ Final Output: ${parsed_response.content}`);
        break; // The task is complete, so exit the loop.
      }

      if (parsed_response.step === "action") {
        const toolName = parsed_response.tool;
        const toolInput = parsed_response.input;

        if (toolName && TOOLS_MAP[toolName]) {
          // If the AI chose a valid tool, execute it.
          const toolResult = await TOOLS_MAP[toolName](toolInput);

          // Create an 'observe' step with the tool's result and add it to the history.
          const observationMessage = {
            role: "assistant",
            content: JSON.stringify({
              step: "observe",
              content: toolResult,
            }),
          };
          messages.push(observationMessage);
        } else {
          console.error(`\nTool '${toolName}' not found.`);
          break;
        }
        continue; // Go to the next loop iteration.
      }
    } else {
      console.error("Invalid response structure:", parsed_response);
      break;
    }
  }
}

// 7. --- MAIN PROGRAM LOOP ---
async function main() {
  console.log("🤖 AI Assistant Started!");
  console.log("Type your queries and I'll help you solve them.\n");
  
  while (true) {
    // Get user query
    const userQuery = await getUserInput("\n📝 Enter your query: ");
    
    if (!userQuery) {
      console.log("Please enter a valid query.");
      continue;
    }
    
    // Process the query
    await processQuery(userQuery);
    
    // Ask for next action
    console.log("\n" + "=".repeat(50));
    const nextAction = await getUserInput("\n🔄 What would you like to do next?\n1. Ask another query\n2. Exit\nEnter your choice (1 or 2): ");
    
    if (nextAction === "2" || nextAction.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye! Thanks for using the AI Assistant.");
      process.exit(0);
    } else if (nextAction === "1" || nextAction.toLowerCase() === "continue") {
      continue;
    } else {
      console.log("Invalid choice. Continuing with new query...");
      continue;
    }
  }
}

// Start the agent.
main().catch(console.error);
