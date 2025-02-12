let catdog = "cat"; // selects type of pet to fetch
const toggleButton = document.getElementById("toggle")
let imageSetURL = `https://api.the${catdog}api.com/v1/images/search?limit=9`;
toggleButton.addEventListener("click", () => {
    if (catdog = "cat") {
        catdog = "dog";
    } else {
        catdog = "cat;"
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
  
          let record = await response.json();
          console.log("record: ", record);
          const recordLength = record.total_pages;
          console.log('Data fetched successfully:', recordLength);
  
          const pageUrl = baseURL + "?page=";
          const urls = [];
          for (let i = 0; i < recordLength; i++) {
              urls.push(pageUrl + (i + 1) + '&limit=10');
          }
          getAllPages(urls);
    } 
    catch (error) {
        console.error('An error occurred:', error);
    }
}

// do the initial fetch
fetchImages();

  