import "dotenv/config";

const getOpenAiApiResponce = async (message) => {
    const options = {
        method: "POST",
        headers: {   // fixed
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini",
            messages: [   // fixed (array)
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const data = await fetch("https://api.openai.com/v1/chat/completions", options);
        const response = await data.json();
        return response.choices[0].message.content;
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
}


export default getOpenAiApiResponce;