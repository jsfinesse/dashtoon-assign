import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";
import "./App.css";

const ComicPanel = () => {
    const [queries, setQueries] = useState([
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
        { prompt: "", text: "" },
    ]);

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);

    const handleInputChange = (index, field, value) => {
        const newQueries = [...queries];
        newQueries[index][field] = value;
        setQueries(newQueries);
    };

    const fetchData = async () => {
        try {
            const imagePromises = queries.map(async ({ prompt, text }) => {
                const response = await queryAPI({ inputs: prompt });
                return { imageUrl: URL.createObjectURL(response), text };
            });

            const images = await Promise.all(imagePromises);
            setImages(images);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Fetch data error:", error);
            toast.error(
                "An error occurred while fetching data. Please try again."
            );
        }
    };

    const queryAPI = async (data) => {
        const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    Accept: "image/png",
                    Authorization:
                        "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        const result = await response.blob();
        return result;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchData();
        setButtonPressed(true);
    };

    return (
        <div className="parent">
            <ToastContainer />
            <div className="comic-panel">
                <h1 style={{ color: "#4caf50", margin: "10px 0 50px 0" }}>
                    Comic Book Panel
                </h1>
                <form onSubmit={handleSubmit}>
                    {queries.map((query, index) => (
                        <>
                            <div key={index} className="query-input">
                                <label>
                                    Query {index + 1}:
                                    <input
                                        required
                                        type="text"
                                        value={query.prompt}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "prompt",
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <div key={index} className="query-input">
                                <label>
                                    Text {index + 1}:
                                    <input
                                        required
                                        type="text"
                                        value={query.text}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "text",
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>
                        </>
                    ))}
                    <div className="button-container">
                        <button type="submit" className="fetch-button">
                            Fetch Images
                        </button>
                    </div>
                </form>
                {buttonPressed && loading ? (
                    <Loader />
                ) : (
                    <div className="page-container">
                        {images.map((image, index) => (
                            <div key={index} className="comic-panel-item">
                                <img
                                    src={image.imageUrl}
                                    alt={`Comic Panel ${index + 1}`}
                                    className="comic-image"
                                />
                                <div className="speech-bubble">
                                    {image.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComicPanel;
