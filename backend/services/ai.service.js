// import { GoogleGenerativeAI } from "@google/generative-ai"

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.0-pro",
//     generationConfig: {
//         responseMimeType: "application/json",
//         temperature: 0.4,
//     },
//     systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
//     Examples: 

//     <example>
 
//     response: {

//     "text": "this is you fileTree structure of the express server",
//     "fileTree": {
//         "app.js": {
//             file: {
//                 contents: "
//                 const express = require('express');

//                 const app = express();


//                 app.get('/', (req, res) => {
//                     res.send('Hello World!');
//                 });


//                 app.listen(3000, () => {
//                     console.log('Server is running on port 3000');
//                 })
//                 "
            
//         },
//     },

//         "package.json": {
//             file: {
//                 contents: "

//                 {
//                     "name": "demo-server",
//                     "version": "1.0.0",
//                     "main": "index.js",
//                     "scripts": {
//                         "test": "echo \"Error: no test specified\" && exit 1"
//                     },
//                     "keywords": [],
//                     "author": "",
//                     "license": "ISC",
//                     "description": "",
//                     "dependencies": {
//                         "express": "^4.21.2"
//                     }
// }

                
//                 "
                
                

//             },

//         },

//     },
//     "buildCommand": {
//         mainItem: "npm",
//             commands: [ "install" ]
//     },

//     "startCommand": {
//         mainItem: "node",
//             commands: [ "app.js" ]
//     }
// }

//     user:Create an express application 
   
//     </example>


    
//        <example>

//        user:Hello 
//        response:{
//        "text":"Hello, How can I help you today?"
//        }
       
//        </example>
    
//  IMPORTANT : don't use file name like routes/index.js
       
       
//     `
// });

// export const generateResult = async (prompt) => {
//     const result = await model.generateContent(prompt);
//     return result.response.text()
// }



import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are an expert in MERN and Development. You have an experience of 10 years in the development.
You always write code in modular and break the code in the possible way and follow best practices.
You use understandable comments in the code, you create files as needed, you write code while maintaining
the working of previous code. You always follow the best practices of the development.
You never miss the edge cases and always write code that is scalable and maintainable.
In your code you always handle the errors and exceptions.

Examples:

<example>
response: {
  "text": "this is you fileTree structure of the express server",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express'); ..."
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}
user: Create an express application
</example>

<example>
user: Hello
response: {
  "text": "Hello, How can I help you today?"
}
</example>

IMPORTANT: don't use file name like routes/index.js
`;

// export const generateResult = async (prompt) => {
//   try {
//     const response = await cohere.chat({
//       model: "command-a-03-2025",
//       messages: [
//         { role: "system", content: SYSTEM_INSTRUCTION },
//         { role: "user", content: prompt },
//       ],
//     });

//     // In v2, the response message content is an array of objects
//     const contentArray = response?.message?.content;

//     if (!contentArray || !contentArray.length) {
//       console.error("Cohere returned empty content:", response);
//       throw new Error("Cohere returned empty content");
//     }

//     // Each item may have a 'text' property
//     const textParts = contentArray
//       .map((item) => item?.text)
//       .filter(Boolean); // remove undefined/null

//     if (!textParts.length) {
//       console.error("Cohere returned content with no text:", response);
//       throw new Error("Cohere returned content with no text");
//     }

//     // Combine all text parts into a single string
//     return textParts.join("\n");
//   } catch (error) {
//     console.error("Cohere Generation Error:", error);
//     throw new Error("Failed to generate response from Cohere");
//   }
// };


export const generateResult = async (prompt) => {
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION + `
IMPORTANT RULES:
- Respond ONLY with valid JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- The response MUST be parseable by JSON.parse()
`
        },
        { role: "user", content: prompt }
      ],
    });

    const contentArray = response?.message?.content;

    if (!contentArray?.length) {
      throw new Error("Empty Cohere response");
    }

    // Combine text parts
    const rawText = contentArray
      .map(item => item?.text)
      .filter(Boolean)
      .join("")
      .trim();

    // 🔥 FORCE JSON PARSE HERE
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Cohere did NOT return valid JSON:", rawText);
      throw new Error("Cohere response is not valid JSON");
    }

    // Always return STRINGIFIED JSON to frontend
    return JSON.stringify(parsed);

  } catch (error) {
    console.error("Cohere Generation Error:", error);
    throw error;
  }
};

