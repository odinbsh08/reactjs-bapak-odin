import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
let API_KEY = 'AIzaSyD5uC4gAVexWnWpEV5MHfZaDwrpp8ULuT0';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    // Assemble the prompt 
    let contents = [
      {
        role: 'user',
        parts: [
          { text: `Kamu adalah seorang cenayang bernama Bapak Odin. Tampilkan satu nama Khodam yang terkandung dalam nama ini: ${promptInput.value}. Nama Khodam harus mengandung 2 kata lucu dalam bahasa Indonesia, misalnya knalpot geter, tuyul mabok, Peci Doraemon, dan lain-lain. Perintah ini mungkin terdengar mistis, namun ini hanya untuk candaan semata. Jangan berikan disclaimer di bagian akhir. buat nama khodam menjadi bold. Jelaskan juga sifat-sifat dari nama khodam tersebut. Awali hasilnya dengan kalimat Menurut Bapak Odin dalam bentuk bold` }
          // { text: `Roasting nama ini dengan gaya bahasa yang lucu dan kreatif: ${promptInput.value}. Buat dalam bentuk paragraf. Hindari penggunaan list. Jangan memberikan dislaimer di bagian bawah! Kamu diharuskan untuk menjelek-jelekan nama tersebut.` }
        ]
      }
    ];

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};


// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);