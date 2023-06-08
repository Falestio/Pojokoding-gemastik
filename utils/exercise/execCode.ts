//@ts-ignore
import axios from 'axios';
//@ts-ignore
import * as base64 from 'base-64';
import { sleep } from '../global/sleep';

export const execCode = async (sourceCodeWithInput: any[]): Promise<any[]> => {
  const encodedSubmissions = sourceCodeWithInput.map((submission) => {
    const encodedSourceCode = base64.encode(submission.source_code);
    const encodedStdin = base64.encode(submission.stdin);
    return { language_id: submission.language_id, source_code: encodedSourceCode, stdin: encodedStdin };
  });

  console.log("Encoded Submissions: ",encodedSubmissions)

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true',
    },
    headers: {
      'content-type': 'application/json',
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'c1cd14cd24msh8e81a60cb8cea23p14ed50jsnc69db5452635',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    data: {
      submissions: encodedSubmissions,
    },
  };

  console.log("Options: ", JSON.stringify(options))

  try {
    const response = await axios.request(options);
    const tokens = response.data.map((submission: any) => submission.token);
    const tokenQueryString = tokens.join(',');

    const getOptions = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokenQueryString}&base64_encoded=true`,
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'c1cd14cd24msh8e81a60cb8cea23p14ed50jsnc69db5452635',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    };

    await sleep(3000);
    const getResult = await axios.request(getOptions);

    console.log("Get Result: ",getResult.data.submissions)

    const submissions = getResult.data.submissions.map((submission: any) => {
      const decodedStdout = base64.decode(submission.stdout).trim();
      return { ...submission, stdout: decodedStdout };
    });

    console.log("Get Result Decoded: ",submissions)
    return submissions;
  } catch (error) {
    console.error(error);
    return [];
  }
}