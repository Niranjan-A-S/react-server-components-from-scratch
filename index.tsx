import { hydrateRoot } from "react-dom/client";

const reviveJSON = (key: any, value: any) => {
    if (value === '$') return Symbol.for("react.element");
    return value
}

const root = hydrateRoot(
    document,
    //@ts-ignore
    JSON.parse(window.__rscOutput, reviveJSON)
);

window.addEventListener("click", (event: any) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        window.history.pushState(null, "", event.target.href);
        navigate(event.target.href);
    }
});

async function navigate(to: string) {
    const nextPage = await fetch(`${to}&jsx=true`)
        .then(res => res.text())
        .then(jsx => JSON.parse(jsx, reviveJSON));

    root.render(nextPage);
}