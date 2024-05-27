import express from "express";
import { renderToString } from "react-dom/server";
import path from "path";
import { Layout } from "./layout";
import React from "react";

const turnJSXIntoClientObject: any = async (jsx: any) => {
    if (!jsx) return null;

    if (['string', 'number', 'boolean'].includes(typeof jsx)) return jsx;

    if (Array.isArray(jsx)) return await Promise.all(jsx.map(turnJSXIntoClientObject));

    if (typeof jsx === 'object') {
        if (jsx.$$typeof === Symbol.for('react.element')) {
            if (typeof jsx.type === 'string') {
                return {
                    ...jsx,
                    props: await turnJSXIntoClientObject(jsx.props)
                }
            }
            if (typeof jsx.type === 'function') {
                const Component = jsx.type;
                const props = jsx.props;
                const renderedThing = await Component(props);
                return await turnJSXIntoClientObject(renderedThing);
            }
        }

        const entries = Object.entries(jsx);
        const processedEntries: any = await Promise.all(entries.map(async ([props, value]) => [props, await turnJSXIntoClientObject(value)]));
        return Object.fromEntries(processedEntries);
    }

}


const app = express();

app.use(express.static("dist"));

const PORT = 3000;

app.get("/:path", async (req, res) => {
    const page = await import(path.join(process.cwd(), 'dist', 'pages', req.params.path));
    const Component = page.default;
    const clientJSX = await turnJSXIntoClientObject(
        <Layout bgColor="white">
            <Component {...req.query}/>
        </Layout>
    );
    const html = renderToString(clientJSX);
    res.end(html);
});


app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`)
})