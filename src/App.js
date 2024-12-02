import { useState } from "react"

const App = () => {
    const [ image, setImage ] = useState(null)
    const [ value, setValue ] = useState("")
    const [ response, setResponse ] = useState("")
    const [ error, setError ] = useState("")

    const surpriseOptions = [
        "Does the image have a whale?",
        "Is the image fabulously pink?",
        "Does the image have puppies?"
    ]

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
        setValue(randomValue)
    }

    const uploadImage = async (e) => {
        const formData = new FormData()
        setImage(e.target.files[0])
        formData.append("file", e.target.files[0])
        e.target.value = null;
        try {
            const options = {
                method: "POST",
                body: formData,
            }
            const response = await fetch("http://localhost:8000/upload", options)
            const data = await response.json()
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    const analyzeImage = async () => {
        setResponse("")
        if (!image) {
            setError("Error! Must have an existing image!")
            return
        }
        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    message: value,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            }
            const response = await fetch("http://localhost:8000/openai", options)
            const text = await response.text()
            setResponse(text)
        } catch (err) {
            console.log(err)
            setError("Something didn't work! Please try again!")
        }
    }

    const clear = () => {
        setImage(null)
        setValue("")
        setResponse("")
        setError("")
    }

    return (
        <div className="app">
            <section className="search-section">
                <div className="image-container">
                    { image && <img alt="upload" src={URL.createObjectURL(image)} />}
                </div>
                <p className="extra-info">
                    <span>
                      <label htmlFor="upload">Upload an image </label>
                      <input onChange={ uploadImage } id="upload" accept="image/*" type="file" hidden />
                    </span>
                    to ask questions about.
                </p>
                <p>What do you want to know about the image?
                    <button className="surprise" onClick={ surprise } disabled={ response }>Surprise me</button>
                </p>
                <div className="input-container">
                    <input
                        value={ value }
                        placeholder="What is in the image..."
                        onChange={ e => setValue( e.target.value ) }
                    />
                    { (!response && !error) && <button onClick={ analyzeImage }>Ask me</button>}
                    { (response || error) && <button onClick={ clear }>Clear</button>}
                </div>
                { error && <p>{ error }</p> }
                { response && <p className="answer">{ response }</p> }
            </section>
        </div>
    );
}

export default App
