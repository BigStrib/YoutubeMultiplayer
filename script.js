const searchButton = document.getElementById('button');
const container = document.querySelector('.container');
var dropdowns = document.getElementsByClassName("dropdown");









let videoCount = 0;






const wrapper = document.querySelector('.wrapper');




// loop through the dropdown buttons
for (var i = 0; i < dropdowns.length; i++) {
  // add an onclick event listener to each dropdown button
  dropdowns[i].addEventListener("click", function() {
    // toggle the "active" class on the dropdown content when the button is clicked
    this.classList.toggle("active");
  });
}

// add a click event listener to the document
document.addEventListener("click", function(e) {
  // loop through the dropdown buttons
  for (var i = 0; i < dropdowns.length; i++) {
    // check if the clicked element is not a dropdown button or its content
    if (!dropdowns[i].contains(e.target)) {
      // remove the "active" class from the dropdown content
      dropdowns[i].classList.remove("active");
    }
  }
});


// add event listener to submit video on enter key press
const urlInput = document.getElementById('search-bar');
urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // prevent form submission
    searchButton.click(); // simulate button click
  }
});

searchButton.addEventListener('click', () => {
  const url = urlInput.value;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    const videoId = match[1];                                   
    const embedCode = `<iframe style="margin: 0; padding: 0;" width="100%" height="309px" src="https://www.youtube.com/embed/${videoId}?&autohide=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen scrolling="yes"></iframe>
    `;

    const newContainer = document.createElement('div');
    newContainer.classList.add('video-container');
    newContainer.innerHTML = embedCode;
    newContainer.style.margin = '0';
    newContainer.style.padding = '0';
    newContainer.style.position = 'relative'; // make container position:relative






 // move button code here 
 const moveButton = document.createElement('div');
 moveButton.innerHTML = '<span class="material-symbols-outlined" style="font-weight: 100;">drag_pan</span>';
 moveButton.classList.add('move-button');
 moveButton.style.position = 'absolute';
 moveButton.style.top = '4px';
 moveButton.style.left = '3px';
 
 newContainer.appendChild(moveButton);
 
 moveButton.addEventListener('click', () => {
  const currentIndex = Array.from(container.children).indexOf(newContainer);
  if (currentIndex === 0) {
    return; // do nothing for the first video
  } else {
    const previousContainer = container.children[currentIndex - 1];
    container.insertBefore(newContainer, previousContainer); // insert the current container before the previous one
  }
  updateIndices();
});

 
 function updateIndices() {
 const videoContainers = Array.from(container.querySelectorAll('.video-container'));
 videoContainers.forEach((container, index) => {
 container.dataset.index = index;
 });
 }
   
 
 
 

   // end here 

   







    const deleteButton = document.createElement('delete-button');
    deleteButton.innerHTML = '<span class="material-symbols-outlined">&times;</span>';
    deleteButton.classList.add('delete-button');
    deleteButton.style.position = 'absolute'; // make button position:absolute
    deleteButton.style.top = '4'; // position on the top-right corner
    deleteButton.style.right = '3';
    newContainer.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      newContainer.remove();
      videoCount--;
    });

    if (videoCount < 2) {
      container.appendChild(newContainer);
      videoCount++;
    } else {
      const newRow = document.createElement('div');
      newRow.classList.add('video-row');
      newRow.style.display = 'flex';
      newRow.style.justifyContent = 'space-between';
      newRow.appendChild(newContainer);
      container.appendChild(newRow);
      videoCount = 1;
    }
    urlInput.value = '';
  }
});

// Append the video container(s) below the form
const formContainer = document.querySelector('.form-container');
container.style.marginTop = '0px'; // add some margin between the form and videos
document.body.insertBefore(container, formContainer.nextSibling);





