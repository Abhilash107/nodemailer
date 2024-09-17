import express from 'express';
import bodyParser from 'body-parser';
import {submitFeedback} from './feedbackController.js'

const app = express();
app.use(bodyParser.json());


app.post('/submit-feedback', submitFeedback);

app.listen(4000, () => {
    console.log('Server is running on port 8000');
});