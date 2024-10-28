let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading=document.querySelector("#loading");
let btn = document.querySelector("button");
let text=document.querySelector("#text");
let output=document.querySelector(".output");

// File details to hold the uploaded file's information
let fileDetails = {
    mime_type: null,
    data: null
};

// Define the API URL
const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBaW5kyVidjtf56PYq9pseCViz-zpdVuiw";

async function generateResponse() {
    // Define the request options with correct syntax
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { "text": "Solve the Mathematical problem with proper steps of solution" },
                    {
                        "inline_data": {
                            "mime_type": fileDetails.mime_type,
                            "data": fileDetails.data
                        }
                    }
                ]
            }]
        })
    };

    try {
        let response = await fetch(Api_url, RequestOption);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()

        text.innerHTML=apiResponse;
        output.style.display="block"
        console.log("API Response:", apiResponse);
    } catch (error) {
        console.error("Request failed:", error);
    }
    finally{
        loading.style.display="none"
    }
}

// Handle file input change to load and display image
input.addEventListener("change", () => {
    const file = input.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1]; // Get base64 data after the comma
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        // Hide placeholder elements and display the image
        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
        output.style.display="none"
    };

    reader.readAsDataURL(file); // Read file as Data URL to get base64 encoding
});

// Trigger the generateResponse function on button click
btn.addEventListener("click", ()=>{
    loading.style.display="block"
    generateResponse()
});

// Allow clicking on the image upload area to open the file input
innerUploadImage.addEventListener("click", () => {
    innerUploadImage.querySelector("input").click();
});
