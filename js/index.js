let catdog = "cat"; // selects type of pet to fetch
const selected = document.getElementById('selected');
const detailList = document.getElementById('detail-list');
const toggleButton = document.getElementById("toggle")
let imageSetURL = `https://api.the${catdog}api.com/v1/images/search?limit=9`;
toggleButton.addEventListener("click", () => {
    if (catdog == "cat") {
        catdog = "dog";
    } else {
        catdog = "cat";
    }
    // re-fetch the inamge set here
    imageSetURL = `https://api.the${catdog}api.com/v1/images/search?limit=9`;
    fetchImages();
});


// get a set of random pictures from the cat or dog api
async function fetchImages() {
    try {
        const response = await fetch(imageSetURL);
  
        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        let images = await response.json();
        console.log("Image list: ", images);

        const imageContainer = document.getElementById("images");
        // remove previous content
        imageContainer.innerHTML = '';
        for (let image of images) {
            const petID = image.id; // used to lookup details
            const imageURL = image.url;
            imgElt = document.createElement('img');
            imgElt.setAttribute('src', imageURL);
            imgElt.setAttribute('width', image.width);
            imgElt.setAttribute('height', image.height);
            imgElt.setAttribute('alt', `${catdog}image${petID}`);
            imgElt.addEventListener("click", () => { displayImageDetails(petID) });
            imageContainer.appendChild(imgElt);
        }
    } 
    catch (error) {
        console.error('An error occurred:', error);
    }
}

// Do a fetch to get details based on an image id
// Unhide the selected container and sisplay it in there
async function displayImageDetails(petID) {
    try {
        // clear the details list
        detailList.innerHTML = '';

        // fetch details for the selected pet
        const response = await fetch(`https://api.the${catdog}api.com/v1/images/${petID}`);
        
        if (!response.ok) {
            throw new Error('detail fetch failed');
        }

        let details = await response.json();
        if (details.hasOwnProperty('breeds')) {
            for (let detailKey in details.breeds[0]) {
                console.log("detailKey: ", detailKey);
                let detail = details.breeds[0][detailKey];
                let detailText = '';
                if (typeof(detail) === 'object') {
                    if (detail.hasOwnProperty('imperial')) {
                        detailText = `${detailKey}: ${detail.imperial}`;
                    }
                    else {
                        throw new Error('Unexpected detail format');
                    }
                }
                else {
                    detailText = detail;
                }
                let detailElt = document.createElement('li');
                detailElt.innerText = detailText;
                detailList.appendChild(detailElt);
            }
        } else {
            const li = document.createElement('li');
            li.innerHTML = 'No details available for this image';
            detailList.appendChild(li);
        }
        window.scrollTo(0, 0);
        selected.hidden = false;
    }
    catch(error) {
        console.log('An error occurred during the detail fetch: ', error);
    }
}

const doneButton = document.getElementById('done-button');
doneButton.addEventListener('click', () => {
    selected.hidden = true;
});



// do the initial fetch
fetchImages();

  