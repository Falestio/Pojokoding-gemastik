import { execCode } from "./execCode";

export const runTests = async (usersCode: string, testCases: any[], langId: number): Promise<any[]> => {
    console.log("runTest(): ", usersCode, testCases, langId);

    const sourceCodeWithInput = testCases.map((testCase) => {
        return {
            language_id: langId,
            source_code: usersCode,
            stdin: testCase.stdin,
        };
    });

    console.log("sourceCodeWithInput: ", sourceCodeWithInput);

    const submissions = await execCode(sourceCodeWithInput);

    console.log("submissions: ", submissions);

    const results = submissions.map((submission, index) => {
        const testCase = testCases[index];
        const { stdout, stderr } = submission;

        console.log("stdout: ", stdout);
        console.log("expected output: ", testCase.expectedOutput);
        console.log("stderr: ", stderr);

        if (stdout === testCase.expectedOutput && !stderr) {
            console.log("The test case is success")
            console.log(!!stderr)
            testCase.status = "success";
        } else {
            console.log("The test case is failed")
            console.log(!!stderr)
            testCase.status = "failed";
        }

        // Include stdout and stderr in the result
        return {
            ...testCase,
            stdout,
            stderr,
        };
    });

    console.log("results: ", results);

    return results;
};

/*
baut fungsi runTests yang menerima parameter usersCode dan testCases
usersCode adalah kode yang ditulis oleh user berupa string
testCases adalah array berisi test case yang akan dijalankan
langId adalah number berisi id dari language yang digunakan

const testCases = [
    {
        _key: "af6a7357afe2",
        expectedOutput: "Hallo Tio",
        input: "Tio",
        testDesc: 'Tampilkan pesan "Hallo Tio"',
        testTitle: "Tio",
        status: "initial",
    },
    {
        _key: "421738b01e5c",
        expectedOutput: "Hallo yang lain",
        input: "yang lain",
        testDesc: 'Tampilkan pesan "Hallo yang lain"',
        testTitle: "Hallo yang lain",
        status: "initial",
    },
],

dari test case buat array of object untuk digunakan di fungsi execCode
ambil sourece_code dari usersCode
ambil stdin dari testCases.input
ambil language_id dari langId

lalu jalanka fungsi execCode dengan parameter array of object yang sudah dibuat
dari hasil fungsi execCode, ambil output dari masing-masing test case
lalu bandingkan dengan expectedOutput
jika sesuai jadikan status menjadi success
jika gagal failed

*/
