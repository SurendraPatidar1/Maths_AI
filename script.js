let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let btn = document.querySelector("button");
let text = document.querySelector("#text");
let output = document.querySelector(".output");
let textSearch = document.querySelector(".text-search"); // Text input for question

// File details to hold the uploaded file's information
let fileDetails = {
    mime_type: null,
    data: null
};

// Define the API URL
const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBaW5kyVidjtf56PYq9pseCViz-zpdVuiw";

// Generate response for either image or text input
async function generateResponse() {
    loading.style.display = "block";
    let question = textSearch.value.trim();
    
    // Determine if the request is image-based or text-based
    let contents;
    if (fileDetails.data) {
        contents = [{
            "parts": [
                { "text": "Solve the mathematical problem with proper steps of solution." },
                {
                    "inline_data": {
                        "mime_type": fileDetails.mime_type,
                        "data": fileDetails.data
                    }
                }
            ]
        }];
    } else if (question) {
        contents = [{
            "parts": [{ "text": question }]
        }];
    } else {
        text.innerHTML = "Please provide a question or an image.";
        loading.style.display = "none";
        return;
    }

    // Define the request options with correct syntax
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "contents": contents })
    };

    try {
        let response = await fetch(Api_url, RequestOption);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        let apiResponse = data.candidates && data.candidates[0].content.parts[0].text;

        if (apiResponse) {
            text.innerHTML = apiResponse.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        } else {
            text.innerHTML = "Sorry, I couldn't find an answer to your question.";
        }
    } catch (error) {
        console.error("Request failed:", error);
        text.innerHTML = "Sorry, something went wrong. Please try again.";
    } finally {
        output.style.display = "block";
        loading.style.display = "none";
    }
}

// Handle file input change to load and display image
input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
        output.style.display = "none";
    };

    reader.readAsDataURL(file);
});

// Trigger the generateResponse function on button click
btn.addEventListener("click", generateResponse);

// Allow clicking on the image upload area to open the file input
innerUploadImage.addEventListener("click", () => {
    innerUploadImage.querySelector("input").click();
});
