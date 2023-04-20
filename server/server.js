import express from 'express';
import * as dotenv from 'dotenv'; // allow us to get data from dotenv file
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({ //funvtion that accpts obj and there we need to pass api key
    apiKey: process.env.OpenAI_API_KEY,
});

const openai = new OpenAIApi(configuration); //create instance of openai & we pass that configuration 

const app = express(); // initialize express applications by app
app.use(cors()); // allows us to make cross origin request  & allow server to call from frontend
app.use(express.json());// allows us to pass json from frontend to backend

app.get('/', async(req, res)=>{
    res.status(200).send({
        message: 'Hello from Codex',
    })
});

app.post('/', async(req, res)=>{
    try{
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({error})
    }  
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));