import React, { useEffect, useState } from "react";
import { REMOTE_URL } from "../utils";

export const Detail = ({ breed }: { breed: string }) => {
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        fetch(`${REMOTE_URL}/api/breed/${breed}/images/random`)
            .then((r) => r.json())
            .then((data) => setImageUrl(data.message));
    }, []);

    if (!breed) {
        return <h1>No breed found</h1>;
    }

    return (
        <div>
            <h1>{breed}</h1>
            <p>This one is an especially good boi. Look how adorable it is!</p>
            <img alt={breed} src={imageUrl} />
        </div>
    );
};
