const fromText = document.querySelector(".from-text"), 
toText = document.querySelector(".to-text"),
selectTag = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".fa-exchange-alt"),
translateBtn = document.querySelector("button"),
icons = document.querySelectorAll(".icons");

selectTag.forEach((tag,id) => {
    for (const country_code in countries){
        let selected; // selecting English by default as FROM language and Arabe as TO language;
        if (id == 0 && country_code == "en-GB") selected = "selected";
        else if (id == 1 && country_code == "es-ES") selected = "selected";
        let option = `<option value="${country_code}" ${selected} >${countries[country_code]}</option>`
        tag.insertAdjacentHTML("beforeend", option);
        console.log(country_code)
    }    
});

exchangeIcon.addEventListener("click",() =>{
    let aux = fromText.value;
    let auxSelect = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = aux;
    selectTag[1].value = auxSelect;
    exchangeIcon.classList.toggle("rotate");
})

translateBtn.addEventListener("click", () =>{
    let DynmFromText = fromText.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;

    if(!DynmFromText) return;
    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${DynmFromText}!&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText.slice(0,-1);// It remove last letter of toText because it result shows ! at the end of word by default
    });    
});

icons.forEach(icon =>{
    icon.addEventListener("click",({target}) =>{
    if (target.classList.contains("bi-clipboard")){
        // If clicked icon has id's "from", it would copy the fromTextArea's value, else it copy the other textArea
        if (target.id == "from")
            navigator.clipboard.writeText(fromText.value)
        else
        navigator.clipboard.writeText(toText.value)
    } 
    else {
        if (target.id == "from"){
            utterance = new SpeechSynthesisUtterance(fromText.value);
            utterance.lang = selectTag[0].value; // Setting utterance language to fromSelect tag value
        }
        else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = selectTag[1].value; // Setting utterance language to toSelect tag value
            console.log("Selected language code:", utterance.lang); // Check the selected language code in the console.
        }
        speechSynthesis.speak(utterance); //speak the passed utterance
    }
});
});

fromText.addEventListener("keyup",()=>{
    if (!fromText.value){
        toText.value= "";
        toText.setAttribute("placeholder","Translation")
    }
})