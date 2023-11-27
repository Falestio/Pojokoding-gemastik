import axios from "axios";

export const runCode = async (compilableCode: string, compiledStdin: string, languageName: string) => {
    const options = {
        method: "POST",
        url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "c1cd14cd24msh8e81a60cb8cea23p14ed50jsnc69db5452635",
            "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
        },
        data: {
            language: languageName,
            stdin: compiledStdin,
            files: [
                {
                    name: "index.py",
                    content: compilableCode,
                },
            ],
        },
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
