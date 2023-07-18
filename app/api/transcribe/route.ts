//import { IncomingForm } from "formidable";
import { Configuration, OpenAIApi } from 'openai';
//import { uuidv4 } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid';
const { spawn } = require('node:child_process');

const fs = require('fs');

// let recordPromise = (SPEECH_AUDIO_PATH = '/temp') => {
//   let audioFilePath = path.join(SPEECH_AUDIO_PATH, uuidv4() + '.mp3');
//   return new Promise((resolve, reject) => {
//     const spawned = spawn('sox', [
//       '-d',
//       '-t',
//       'mp3',
//       audioFilePath,
//       'silence',
//       '1',
//       '0.1',
//       '3%',
//       '1',
//       '3.0',
//       '3%',
//     ]);
//     spawned.on('error', data => {
//       reject(data);
//     });
//     spawned.on('exit', code => {
//       if (code === 0) {
//         return resolve(audioFilePath);
//       }
//       return reject('close code is ' + code);
//     });
//   });
// };
// const proxy = {
//   type: 'http',
//   host: '127.0.0.1',
//   port: 7890,
// };

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request, res: Response) {
  let filePath = '';
  try {
    console.log(process.env.OPENAI_API_KEY, 'process.env.OPENAI_API_KEY');
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const formData = await req.formData();

    //Get file from formData
    const file = formData.get('file') as File;
    const fileId = uuidv4();

    let extension = '';
    if (file.type == 'audio/mp3') {
      extension = '.mp3';
    }

    const fileName = fileId + extension;

    const arrayBuffer = await file.arrayBuffer();
    const view = new Uint8Array(arrayBuffer);

    filePath = `/tmp/${fileName}`;

    console.log('filePath', filePath);

    fs.writeFileSync(filePath, view);

    const resp = await openai.createTranscription(
      fs.createReadStream(filePath),
      'whisper-1'
      // Uncomment the line below if you would also like to capture filler words:
      // "Please include any filler words such as 'um', 'uh', 'er', or other disfluencies in the transcription. Make sure to also capitalize and punctuate properly."
    );
    console.log(resp, 'resp from wish0er');
    const transcript = resp?.data?.text;
    console.log(transcript, 'transcript');

    // Here, we create a temporary file to store the audio file using Vercel's tmp directory
    // As we compressed the file and are limiting recordings to 2.5 minutes, we won't run into trouble with storage capacity
    //   const fData = await new Promise<{ fields: any; files: any }>(
    //     (resolve, reject) => {
    //       const form = new IncomingForm({
    //         multiples: false,
    //         uploadDir: "/tmp",
    //         keepExtensions: true,
    //       });
    //       console.log(form,'data' );

    //       form.parse(req, (err, fields, files) => {
    //         if (err) return reject(err);
    //         resolve({ fields, files });
    //       });
    //     }
    //   );

    //   const formData = await req.formData();
    //   const file = formData.get('file');
    //   let writeStream = fs.createWriteStream(`/tmp/${file.name}`);

    //   async function write() {
    //     return new Promise((resolve, reject) => {
    //         writeStream.on('finish', function() {
    //             resolve('complete');
    //             });
    //         writeStream.on('error', reject);
    //         });
    //     }
    //     await write();
    //     console.log('file.name',file.name );

    //     const resp = await openai.createTranscription(
    //         fs.createReadStream(`/tmp/${file.name}`),
    //         "whisper-1"
    //     // Uncomment the line below if you would also like to capture filler words:
    //     // "Please include any filler words such as 'um', 'uh', 'er', or other disfluencies in the transcription. Make sure to also capitalize and punctuate properly."
    //     );
    //     console.log(resp,'resp from wish0er' );
    //     const transcript = resp?.data?.text;
    //     console.log(transcript,'transcript' );

    return new Response(JSON.stringify(transcript), {
      status: 200,
    });

    // return resp.data;
  } catch (error) {
    console.error('server error', error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  } finally {
    fs.unlinkSync(filePath);
  }
}
