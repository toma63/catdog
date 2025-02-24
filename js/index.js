let catdog = "cat"; // selects type of pet to fetch
const selected = document.getElementById('selected');
const detailList = document.getElementById('detail-list');
const detailHeading = document.getElementById('detail-heading');
const toggleButton = document.getElementById("toggle")
const imageContainer = document.getElementById("images");
let imageSetURL = `https://api.the${catdog}api.com/v1/images/search?limit=9&has_breeds=1`;
toggleButton.addEventListener("click", () => {
    if (catdog == "cat") {
        catdog = "dog";
        toggleButton.innerText = 'I Prefer Cats';
    } else {
        catdog = "cat";
        toggleButton.innerText = 'I Prefer Dogs';
    }
    // reset the heading
    detailHeading.innerText = `A cute ${catdog} picture`;
    // hide the details
    selected.hidden = true;
    // re-fetch the inamge set here
    imageSetURL = `https://api.the${catdog}api.com/v1/images/search?limit=9&has_breeds=1`;
    fetchImages();
});

// create a single event listener for the images container
// get the id to fetch from the target
imageContainer.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('clickable')) {
        console.log('Clicked element:', event.target);
        // Get the id and do a second fetch
        const petID = event.target.getAttribute('id');
        displayImageDetails(petID);
    }
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
            imgElt.setAttribute('id', petID);
            imgElt.classList.add('clickable');
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
        detailHeading.innerText = `A cute ${catdog} picture`;

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
                } else if ((detailKey === 'id') || detailKey === 'reference_image_id') {
                    continue;
                } else if (detailKey === 'name') {
                    detailHeading.innerText = detail;
                    continue;
                } else {
                    detailText = `${detailKey}: ${detail}`;
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

  