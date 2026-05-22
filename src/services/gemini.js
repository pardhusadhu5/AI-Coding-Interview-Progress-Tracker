import { GoogleGenerativeAI } from '@google/generative-ai';

const MOCK_QUESTIONS = {
  algorithms: {
    easy: [
      {
        id: 'algo_easy_1',
        title: 'Two Sum',
        problemDescription: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
        constraints: '• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9',
        starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
        expectedComplexity: 'Time Complexity: O(n), Space Complexity: O(n)'
      },
      {
        id: 'algo_easy_2',
        title: 'Valid Palindrome',
        problemDescription: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
        constraints: '• 1 <= s.length <= 2 * 10^5\n• s consists only of printable ASCII characters.',
        starterCode: 'function isPalindrome(s) {\n  // Write your code here\n  \n}',
        expectedComplexity: 'Time Complexity: O(n), Space Complexity: O(1)'
      }
    ],
    medium: [
      {
        id: 'algo_med_1',
        title: 'Longest Substring Without Repeating Characters',
        problemDescription: 'Given a string `s`, find the length of the longest substring without repeating characters.',
        constraints: '• 0 <= s.length <= 5 * 10^4\n• s consists of English letters, digits, symbols and spaces.',
        starterCode: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}',
        expectedComplexity: 'Time Complexity: O(n), Space Complexity: O(min(m, n))'
      }
    ],
    hard: [
      {
        id: 'algo_hard_1',
        title: 'Merge k Sorted Lists',
        problemDescription: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\nMerge all the linked-lists into one sorted linked-list and return it.',
        constraints: '• k == lists.length\n• 0 <= k <= 10^4\n• 0 <= lists[i].length <= 500',
        starterCode: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction mergeKLists(lists) {\n  // Write your code here\n  \n}',
        expectedComplexity: 'Time Complexity: O(N log k), Space Complexity: O(1)'
      }
    ]
  },
  react: {
    easy: [
      {
        id: 'react_easy_1',
        title: 'Counter Component with Hooks',
        problemDescription: 'Build a standard React functional component that displays a counter. It must have buttons to increment and decrement, and an input to set a custom initial count value dynamically. Ensure that it does not cause infinite re-renders.',
        constraints: '• Use functional component syntax.\n• Hook usages: useState, useEffect.',
        starterCode: 'import React, { useState } from "react";\n\nexport default function Counter() {\n  // Your component state and functions here\n  \n  return (\n    <div>\n      {/* Write JSX here */}\n    </div>\n  );\n}',
        expectedComplexity: 'Optimal rendering, state management best practices.'
      }
    ],
    medium: [
      {
        id: 'react_med_1',
        title: 'Custom UseFetch Hook',
        problemDescription: 'Create a custom React hook called `useFetch` that accepts a URL and options object. It should return an object containing `data` (the fetched response), `loading` (boolean status), and `error` (any thrown error). Handle aborting calls on unmount and loading lifecycle correctly.',
        constraints: '• Handle cleanup of AbortController properly on unmount.\n• Maintain status states in a single reducer or separate states.',
        starterCode: 'import { useState, useEffect } from "react";\n\nexport default function useFetch(url, options = {}) {\n  // Implement custom hook\n  \n}',
        expectedComplexity: 'Correct cleanup, memory leak avoidance, loading indicators.'
      }
    ],
    hard: [
      {
        id: 'react_hard_1',
        title: 'Virtualized List Component',
        problemDescription: 'Create a simple Virtualized List component in React to render a list of 100,000 items efficiently. It should only render items currently visible in the scroll viewport plus a small buffer. Design it to work with a fixed row height.',
        constraints: '• Do not use any external virtualization libraries.\n• Use scroll events and transforms for positioning.',
        starterCode: 'import React, { useState, useRef } from "react";\n\nexport default function VirtualList({ items, itemHeight, viewportHeight }) {\n  // Implement virtualization logic\n  \n}',
        expectedComplexity: 'O(visible_items) rendering complexity instead of O(total_items)'
      }
    ]
  },
  system_design: {
    easy: [
      {
        id: 'sys_easy_1',
        title: 'Design an URL Shortener',
        problemDescription: 'Explain the high-level design of an URL shortening service like Bit.ly. Address the system requirements, API design (endpoints), database schema, and how you will generate a unique short key for each long URL.',
        constraints: '• System handles 100M new URLs created per month.\n• Explain key generation (MD5, Base62 encoding) and collisions.',
        starterCode: '// Summarize your architectural outline, endpoints, schema, and calculations here:\n',
        expectedComplexity: 'Simple architecture layout, basic database selection.'
      }
    ],
    medium: [
      {
        id: 'sys_med_1',
        title: 'Design a Real-time Notification System',
        problemDescription: 'Outline a system design for a real-time notification service that sends web push notifications, emails, and SMS alerts to users dynamically. Design for high throughput (10,000 notifications/sec) and guarantee at-least-once delivery.',
        constraints: '• Handle multiple channels (SMS, Email, Push).\n• Leverage message queues (Kafka, RabbitMQ) and caching.',
        starterCode: '// Summarize your architecture, queue integrations, websocket vs push decisions here:\n',
        expectedComplexity: 'Message brokering, connection management, failure handlers.'
      }
    ],
    hard: [
      {
        id: 'sys_hard_1',
        title: 'Design a Distributed Rate Limiter',
        problemDescription: 'Design a rate limiter that can be deployed across a cluster of servers to limit client request counts globally. Explain how you will handle shared state (Redis vs local) and concurrency issues (race conditions). Describe sliding window algorithms.',
        constraints: '• Scale to 1M requests per second.\n• Low latency (adds < 5ms to the request pipeline).',
        starterCode: '// Summarize rate limiting algorithms, redis data models, lock mechanisms here:\n',
        expectedComplexity: 'Sliding window, token bucket algorithms, race-condition mitigation.'
      }
    ]
  }
};

// Local storage prefix
const STORAGE_PREFIX = 'codepilot_';

export const getGeminiApiKey = () => {
  return localStorage.getItem(`${STORAGE_PREFIX}gemini_api_key`) || '';
};

export const saveGeminiApiKey = (key) => {
  if (key) {
    localStorage.setItem(`${STORAGE_PREFIX}gemini_api_key`, key);
  } else {
    localStorage.removeItem(`${STORAGE_PREFIX}gemini_api_key`);
  }
};

// Check if we are running in simulation mode for Gemini
export const isGeminiSimulated = () => {
  return !getGeminiApiKey();
};

// Service calls
export const geminiService = {
  async fetchQuestion(topic, difficulty) {
    // If not simulated, we could call Gemini, but using pre-seeded questions is much faster
    // and keeps the interface highly curated. We will fetch from local registry.
    const category = MOCK_QUESTIONS[topic] || MOCK_QUESTIONS.algorithms;
    const questions = category[difficulty] || category.easy;
    
    // Return a random question from list
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  },

  async analyzeCode(questionTitle, description, codeSolution, topic) {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      // Return high-quality mock evaluation
      return new Promise((resolve) => {
        setTimeout(() => {
          const rating = codeSolution.length > 150 ? 'Excellent' : codeSolution.length > 50 ? 'Good' : 'Needs Work';
          const score = rating === 'Excellent' ? 92 : rating === 'Good' ? 78 : 45;
          
          let improvements = [
            'Add comments to make the code more readable.',
            'Handle edge cases like empty inputs, null parameters, or negative values.',
            'Consider adding unit tests to verify logic constraints.'
          ];

          let refactoredCode = `// Optimised implementation\n`;
          if (topic === 'algorithms') {
            refactoredCode += `function solved(inputs) {\n  // Optimized solution using a hash map to run in linear O(N) time\n  const lookup = new Map();\n  for (let i = 0; i < inputs.length; i++) {\n    // process indices...\n  }\n  return null;\n}`;
            improvements.push('Optimize double loop structures into hash map lookups to reduce complexity from O(n^2) to O(n).');
          } else if (topic === 'react') {
            refactoredCode += `import React, { useState, useCallback, useMemo } from 'react';\n\nexport default function OptimisedComponent() {\n  // Memoised handler to prevent children re-renders\n  const handleAction = useCallback(() => {\n    // action...\n  }, []);\n  \n  return <div onClick={handleAction}>Demo</div>;\n}`;
            improvements.push('Implement React.useCallback or React.useMemo to memoize event handlers and avoid rendering churn.');
          } else {
            refactoredCode += `// System Design Architectural Highlight\n// 1. Load Balancer (NGINX/AWS ALB) to split traffic\n// 2. API Gateway for auth and rate limiting\n// 3. Redis cluster for caching and distributed locks\n// 4. Message Queues (Kafka) to absorb write spikes`;
            improvements.push('Include high-level caching layers (Redis/Memcached) to minimize direct database reads.');
          }

          resolve({
            score,
            rating,
            correctness: rating === 'Excellent' 
              ? 'Your code logic is correct, passes all default parameters and respects execution boundaries.' 
              : rating === 'Good' 
              ? 'Code is functional, but lacks optimization details and does not support full boundary constraints.' 
              : 'The code is incomplete or contains critical logical flaws that would cause compile or runtime failures.',
            complexity: topic === 'algorithms' ? 'Time: O(n) | Space: O(n)' : 'Optimal state updates, standard rendering nodes.',
            improvements,
            refactoredCode
          });
        }, 1500); // simulate delay
      });
    }

    try {
      // Use the correct API initialization structure for @google/generative-ai
      // Wait, let's verify if the package import allows new GoogleGenAI({ apiKey }).
      // Yes, in modern `@google/generative-ai` package, it can be initialized with a key:
      // const ai = new GoogleGenAI({ apiKey: apiKey });
      // const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      // Let's write the real API call!
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are a senior tech lead reviewing a candidate's answer for the following coding/design question:
        Question: ${questionTitle}
        Description: ${description}
        Topic Category: ${topic}
        
        Candidate's Code Solution:
        """
        ${codeSolution}
        """

        Perform an in-depth review. Respond STRICTLY with a valid JSON object matching this structure:
        {
          "score": 85, // integer from 0 to 100
          "rating": "Excellent" | "Good" | "Needs Work",
          "correctness": "Feedback on correctness and edge cases",
          "complexity": "Analysis of Time/Space complexity",
          "improvements": ["improvement point 1", "improvement point 2"],
          "refactoredCode": "Your fully optimized, clean implementation"
        }
        Do not wrap the JSON output in markdown formatting (like \`\`\`json). Just return the raw JSON string.
      `;

      const response = await model.generateContent(prompt);
      const text = response.response.text().trim();
      
      // Clean markdown tags if Gemini outputs them anyway
      const cleanedJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error('Error invoking Gemini API:', e);
      throw new Error('Gemini API Error: ' + e.message);
    }
  },

  async generateRoadmap(careerGoal) {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      // Return beautiful mock roadmap based on goal
      return new Promise((resolve) => {
        setTimeout(() => {
          const milestones = [
            {
              id: 'm1',
              title: 'Core Fundamentals',
              description: `Master key concepts for ${careerGoal}`,
              tasks: [
                { id: 't1_1', title: 'Data Structures and Big O complexity', completed: true },
                { id: 't1_2', title: 'Advanced language concepts (Closures, Prototype, Async)', completed: false },
                { id: 't1_3', title: 'Basic design patterns and solid principles', completed: false }
              ]
            },
            {
              id: 'm2',
              title: 'Framework Mastery & Architecture',
              description: 'Focus on scale, performance, and UI details',
              tasks: [
                { id: 't2_1', title: 'State management solutions (Redux Toolkit, Context, Zustand)', completed: false },
                { id: 't2_2', title: 'Component lifecycle, memoization, and custom hooks', completed: false },
                { id: 't2_3', title: 'Writing robust integration and unit test plans', completed: false }
              ]
            },
            {
              id: 'm3',
              title: 'System Design & High Performance',
              description: 'Scale systems globally and manage throughput',
              tasks: [
                { id: 't3_1', title: 'Caching layers, CDN, load balancer configuration', completed: false },
                { id: 't3_2', title: 'Database optimization: indexing, replication, sharding', completed: false },
                { id: 't3_3', title: 'Monitoring, logging pipelines, and security headers', completed: false }
              ]
            }
          ];
          resolve(milestones);
        }, 1200);
      });
    }

    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Create a custom learning roadmap to become a ${careerGoal}.
        Return STRICTLY a valid JSON array of milestones. Each milestone must have this format:
        {
          "id": "unique_string",
          "title": "Milestone Title",
          "description": "Short description of milestone goal",
          "tasks": [
            { "id": "task_id", "title": "Specific skill/topic to study", "completed": false }
          ]
        }
        Provide exactly 3 or 4 progressive milestones containing 3-4 tasks each.
        Do not wrap the JSON output in markdown formatting (like \`\`\`json). Just return the raw JSON string.
      `;

      const response = await model.generateContent(prompt);
      const text = response.response.text().trim();
      const cleanedJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error('Error generating roadmap with Gemini:', e);
      throw new Error('Gemini API Error: ' + e.message);
    }
  }
};
