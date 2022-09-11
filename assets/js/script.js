$(document).ready(() => {
    let render = new URLSearchParams(window.location.search).get("code")
    let defaultCode = '# To test if the Interpreter is working correctly, feel free to use this file\n# as a playground.\n# We Print MEOW to the console.\n\n# Moving Pointer to 77\nfor 77 move pointer right\n\n# Setting Memory as Pointer + 2\nmemory = pointer + 2\n\nprint char pointer # Will Print M\n\n# Moving pointer left 8 to Point 69\nmove pointer left 8\n\nprint char pointer # Will Print E\nprint char memory # Will Print O\n\n# Setting Memory to 87\nmemory = 87\nif memory == 87 print char memory'
    
    if (render != null) {
        let codeToRender = decodeURI(render)
        codeTextArea.value = codeToRender
    } else {
        codeTextArea.value = defaultCode
    }
    
    render = render != null ? render : defaultCode
    
    $("#code").linedtextarea();
})

const run = document.getElementById("run")
const share = document.getElementById("share")

const loadingGifSrc = "/assets/images/loading.gif"

const codeTextArea = document.getElementById("code")
const outputTextArea = document.getElementById("output")
const home = document.querySelectorAll(".home")
const playgroundEndpoint = `https://infant.onrender.com/api/stable/play`

home.forEach(e => {
    e.addEventListener("click", () => {
        window.location.href = "https://infant-lang.netlify.app"
    })
})

run.addEventListener("click", async () => {
    addLoadingGif(outputTextArea, loadingGifSrc, true)
    let response = await getOutput(codeTextArea)
    renderOutput(response, outputTextArea)
    scrollToElement(outputTextArea)
})

async function getOutput(textArea) {
    let codeArray = textArea.value.split("\n")
    
    let data = {
        code: codeArray
    }

    let response = await fetch(playgroundEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    let responseData = await response.json()

    return responseData
}

function scrollToElement(element) {
    element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    })
}

function renderOutput(jsonResponse, outputTextArea) {
    addLoadingGif(outputTextArea, null, false)
    let output = jsonResponse.output
    outputTextArea.value = output
}

function returnDataForShare(textarea) {
    let outputText = textarea.value.toString()
    let output = encodeURI(outputText)
    return output
}

share.addEventListener("click", async (e) => {
	let title = "Infant Lang Script File"
	let url = window.location.href + "?code=" + returnDataForShare(codeTextArea)
	shareLink(title, url)
})

function shareLink(title, url) {
	if (navigator.share) {
		navigator
			.share({
				title: `${title}`,
				text: "Run this code on the Infant Lang Playground!",
				url: url,
			})
			.catch(() =>
				alert("Unable to Generate Link. Copy the URL and share it!")
			)
	}
}

function addLoadingGif(textArea, src, setLoading) {
    if(setLoading) {
        textArea.value = ""
        textArea.style.backgroundImage = "url('" + src + "')"
        textArea.style.backgroundRepeat = 'no-repeat'
        textArea.style.backgroundPosition = 'center'
        textArea.style.backgroundSize = 'contain'

        return true
    }
    textArea.style.backgroundImage = "none"   
}
