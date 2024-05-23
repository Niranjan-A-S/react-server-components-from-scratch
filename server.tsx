import express from "express";
import { renderToString } from "react-dom/server";
import path from "path";
import { Layout } from "./layout";
import React from "react";

const app = express();

app.use(express.static("dist"));

const PORT = 3000;

app.get("/:path", async (req, res) => {
    const page = await import(path.join(process.cwd(), 'dist', 'pages', req.params.path));
    const Component = page.default;
    const html = renderToString(
        <Layout bgColor="white">
            <Component {...req.query}/>
        </Layout>
    );
    res.end(`${html}`);
})

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`)
})