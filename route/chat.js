import express from "express";
import Thread from "../model/thread.js";
import getOpenAiApiResponce from "../utils/openai.js";

const app = express.Router();

// testing Route
app.post("/thread", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "muskan",
            title: "new chat"
        });
        console.log("successfully", thread);
        await thread.save();
        res.status(201).json(thread);
    } catch (err) {
        res.status(500).json({ error: "failed to create thread" });
    }
})

//Get all threads

app.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 });
        console.log(threads);
        res.json(threads);

    } catch (err) {
        res.status(500).json({ error: "failed to fetch threads" });
    }
})


//Get single thread by id

app.get("/thread/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const threads = await Thread.findOne({ threadId: id });
        if (!threads) {
            res.status(404).json({ error: "thread not found" });
        }
        res.json(threads);

    } catch (err) {
        res.status(500).json({ error: "failed to fetch thread" });
    }
})

//delete Route

app.delete("/thread/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId: id });

        if (!deletedThread) {
            res.status(404).json({ error: "thread not deleted " });
        }
        res.status(200).json({ message: "thread deleted successfully", deletedThread });

    } catch (err) {
        res.status(500).json({ error: "failed to delete thread" });
    }
})

app.delete("/threads", async (req, res) => {
    try {

        const deletedThreads = await Thread.deleteMany({});
        res.status(200).json({ message: "all threads deleted successfully", deletedThreads });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to delete threads" });
    }
})

app.get("/test", async (req, res) => {

    try {
        res.status(200).json({ message: "final updated route is working fine" });

    } catch (err) {
        res.status(500).json({ error: "something went wrong", err })
    }
})
app.get("/test2", async (req, res) => {
    try {
        res.status(200).json({ message: "how are you?" });
    } catch (err) {
        res.status(500).json({ error: "something went wrong", err })
    }
})


//Post Route

// app.post("/chat", async (req, res) => {
//     const { threadId, message } = req.body;

//     if (!threadId || !message) {
//         return res.status(400).json({ error: " all fields are required" });
//     }
//     try {
//         let thread = await Thread.findOne({ threadId });
//         if (!thread) {
//             thread = new Thread({
//                 threadId,
//                 title: "New Chat"
//             });
//         } else {
//             thread.messages.push({ role: "user", content: message });
//         }

//         const assitantResponse = await getOpenAiApiResponce(message);
//         thread.messages.push({ "role": "assistant", "content": assitantResponse });
//         thread.updatedAt = Date.now();

//         await thread.save();
//         res.json({ reply: assitantResponse });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: " something went wrong" ,err});
//     }
// })




app.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "all fields are required" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: "New Chat",
                messages: []
            });
        }

        // push user message
        thread.messages.push({ role: "user", content: message });

        const assistantResponse = await getOpenAiApiResponce(message);

        thread.messages.push({
            role: "assistant",
            content: assistantResponse
        });

        thread.updatedAt = Date.now();

        await thread.save();

        res.json({ reply: assistantResponse });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
});
export default app;