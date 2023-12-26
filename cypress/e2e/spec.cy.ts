const incorrectCode = 
"def isDewasa(umur):\n" +
"if umur >= 18:\n" +
"return \"Dewasa\"\n" +
"else:\n" +
"return \"Belum Dewasa\"";

const correctCode = 
"def isDewasa(umur):\n" +
"if umur >= 18:\n" +
"return \"Anda Sudah Dewasa\"\n" +
"else:\n" +
"return \"Anda Belum Dewasa\"";

describe("Pojokoding E2E Test", () => {
    // it("SUCCEED", () => {
    //     cy.viewport(1920, 1080);

    //     // $ LOGIN USING EMAIL AND PASSWORD FAILED
    //     // Visit the login page
    //     cy.visit("http://localhost:3000/masuk");

    //     // Click on the email form and type in an incomplete email
    //     cy.get('[data-cy="masuk-form-email"]').click().clear().focus().type("falestionewsletter");

    //     // Click on the password form and type in a password
    //     cy.get('[data-cy="masuk-form-password"]').click().type("Falestio");

    //     // Check if the login button is still disabled
    //     cy.get('[data-cy="masuk-submit"]').should("be.disabled");

    //     // Correct the email and complete it
    //     cy.get('[data-cy="masuk-form-email"]')
    //         .clear() // Clear the current incomplete email
    //         .type("falestionewsletter@gmail.com");

    //     // Click the login button
    //     cy.get('[data-cy="masuk-submit"]').click();

    //     // Check if the error message is displayed

    //     // $ LOGIN USING EMAIL AND PASSWORD SUCCESS
    //     // Mengklik dan mengetikkan email ke dalam field email
    //     // Menggunakan data-cy untuk menemukan field yang tepat
    //     cy.get('[data-cy="masuk-form-email"]').click().clear().focus().type("falestionewsletter@gmail.com", { delay: 100 }).should("have.value", "falestionewsletter@gmail.com");

    //     // Mengklik dan mengetikkan password ke dalam field password
    //     // Menggunakan data-cy untuk menemukan field yang tepat
    //     cy.get('[data-cy="masuk-form-password"]').click().clear().focus().type("Falestio123@", { delay: 100 }).should("have.value", "Falestio123@");

    //     // Klik tombol submit untuk proses login
    //     // Tombol ini diidentifikasi dengan data-cy="masuk-submit"
    //     cy.get('[data-cy="masuk-submit"]').click();

    //     // Memeriksa apakah URL sekarang termasuk '/dashboard'
    //     // Ini digunakan untuk memverifikasi bahwa login berhasil dan pengguna telah diarahkan ke halaman dashboard
    //     cy.url().should("include", "/dashboard");

    //     // $ CONTENT NAVIGATION
    //     cy.get('[data-cy="navbar-katalog-kursus"]').click();

    //     cy.url().should("include", "/katalog-kursus");

    //     // Click on the link that leads to the Python programming course
    //     cy.get('a[href="/dasar-pemrograman-dengan-python"]').click();

    //     // Check if the URL is now /dasar-pemrograman-dengan-python
    //     cy.url().should("include", "/dasar-pemrograman-dengan-python");

    //     // Click the "Mulai Belajar" (Start Learning) button
    //     cy.get('[data-cy="course-page-mulai-belajar"]').click(); // Adjust the selector if needed

    //     // Check if the URL is now /dasar-pemrograman-dengan-python/pengenalan-python
    //     cy.url().should("include", "/dasar-pemrograman-dengan-python/pengenalan-python");

    //     // $ ARTICLE CONTENT
    //     // Check if the 'Daftar Isi' is present
    //     cy.get('[data-cy="daftar-isi-title"]').should("exist");
    //     cy.get('[data-cy="daftar-isi-list"]').should("exist");

    //     // Click the first link in the 'Daftar Isi'
    //     // Assuming the links are correctly ordered in the DOM
    //     cy.get('[data-cy="daftar-isi-list"] li:first a').click();

    //     // Check if the URL includes the correct hash fragment
    //     cy.url().should("eq", "http://localhost:3000/dasar-pemrograman-dengan-python/pengenalan-python#keunggulan-python");

    //     // Start the quiz
    //     cy.get('[data-cy="article-mulai-quiz"]').click();

    //     // Select the first choice "Ular" and check the answer
    //     cy.get('[data-cy="quiz-choice"]').contains("Ular").click();
    //     cy.get('[data-cy="quiz-cek-jawaban"]').click();
    //     cy.get('[data-cy="quiz-jawaban-salah"]').should("be.visible");

    //     // Select the second choice "Bahasa Pemrograman" and check the answer
    //     cy.get('[data-cy="quiz-choice"]').contains("Bahasa Pemrograman").click();
    //     cy.get('[data-cy="quiz-cek-jawaban"]').click();
    //     cy.get('[data-cy="quiz-jawaban-benar"]').should("be.visible");

    //     // Go to the next question
    //     cy.get('[data-cy="quiz-pertanyaan-selanjutnya"]').click();

    //     // Interaction with subsequent questions (assuming they follow similar patterns)
    //     // Click choice "x = 10", check the answer, and verify the message
    //     cy.get('[data-cy="quiz-choice"]')
    //         .filter((index, element) => {
    //             return element?.textContent?.trim() === "x = 10";
    //         })
    //         .click();
    //     cy.get('[data-cy="quiz-cek-jawaban"]').click();
    //     cy.get('[data-cy="quiz-jawaban-benar"]').should("be.visible");

    //     // Go to the next question
    //     cy.get('[data-cy="quiz-pertanyaan-selanjutnya"]').click();

    //     // Click choice "django", check the answer, and verify the message
    //     cy.get('[data-cy="quiz-choice"]').contains("Django").click();
    //     cy.get('[data-cy="quiz-cek-jawaban"]').click();
    //     cy.get('[data-cy="quiz-jawaban-benar"]').should("be.visible");

    //     // After the final question, click the "finish" button
    //     cy.get('[data-cy="quiz-selesai"]').click();

    // });

    // TODO: check progress
    // TODO: hapus progress ketika selesai testing
    
    it("Test Latihan", () => {
        cy.viewport(1920, 1080);

        // Visit the exercise content page
        cy.visit("http://localhost:3000/dasar-pemrograman-dengan-python/testing-fitur-latihan-python-one-compiler");

        // Check if the URL is correct
        cy.url().should("include", "/dasar-pemrograman-dengan-python/testing-fitur-latihan-python-one-compiler");

        // Check if the title, problem statement, test cases, and code editor appear
        cy.get("[data-cy=exercise-title]").should("be.visible");
        cy.get("[data-cy=exercise-prompt]").should("be.visible");
        cy.get("[data-cy=exercise-test-case]").should("be.visible");
        cy.get("[data-cy=exercise-code-editor] .cm-content").should("be.visible");

        // Write an incorrect answer in the code editor
        cy.get("[data-cy=exercise-code-editor] .cm-content").clear({ force: true }).focus().type(incorrectCode, { force: true, parseSpecialCharSequences: false, delay: 100 });

        // Click submit
        cy.get("[data-cy=exercise-submit]").click();

        // Check for error message
        cy.get("[data-cy=exercise-failed-badge]").should("be.visible");

        // Clear the editor and write the correct answer
        cy.get("[data-cy=exercise-code-editor] .cm-content").clear({ force: true }).focus().type(correctCode, { force: true, parseSpecialCharSequences: false, delay: 100 });

        // Click submit again
        cy.get("[data-cy=exercise-submit]").click();

        // Check for success message on test case
        cy.get("[data-cy=exercise-success-badge]").should("be.visible"); // Replace with actual selector

        // Check for success message popup
        cy.get('.Vue-Toastification__toast-body').should('contain', 'Selamat');
    
        // check if the progress is being recorded
        
    });
});
