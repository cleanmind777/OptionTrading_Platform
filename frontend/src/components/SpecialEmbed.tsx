import React, { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface SpecialEmbedProps {
    url: string; // URL to fetch the special HTML from
    id?: string;
}

const SpecialEmbed: React.FC<SpecialEmbedProps> = ({ url, id }) => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!url) {
            setError("No URL provided");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");
        const realURL = `${BACKEND_URL}/backtest${url}`
        axios.get(realURL, {
            headers: {
                'Accept': 'text/html'
            },
            params: {
                backtest_id: id
            },
            responseType: 'text'
        })
            .then((response) => {
                setHtmlContent(response.data);
            })
            .catch((error) => {
                console.error("Error fetching special HTML:", error);
                setError("Failed to load content");
                setHtmlContent("<p>Failed to load content.</p>");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [url]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="w-full" />;
};

export default SpecialEmbed;