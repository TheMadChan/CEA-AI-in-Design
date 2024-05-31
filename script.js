document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector(".carousel");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    let currentIndex = 0;
    let isDragging = false;
    let startPosX = 0;
    let currentPosX = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(-${index * 100}%)`;
      });
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        showSlide(currentIndex);
      }
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        showSlide(currentIndex);
      }
    }

    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startPosX = e.clientX;
    });

    carousel.addEventListener("mouseup", () => {
      isDragging = false;
      const deltaX = currentPosX - startPosX;
      if (deltaX > 1) {
        prevSlide();
      } else if (deltaX < -1) {
        nextSlide();
      }
    });

    carousel.addEventListener("mousemove", (e) => {
      if (isDragging) {
        currentPosX = e.clientX;
      }
    });

    carousel.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    // Touch events for touch devices
    carousel.addEventListener("touchstart", (e) => {
      isDragging = true;
      startPosX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchmove", (e) => {
      if (isDragging) {
        currentPosX = e.touches[0].clientX;
      }
    });

    carousel.addEventListener("touchend", () => {
      isDragging = false;
      const deltaX = currentPosX - startPosX;
      if (deltaX > 50) {
        prevSlide();
      } else if (deltaX < -50) {
        nextSlide();
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
      let isDropdownChange = false; // Flag to track if dropdown change triggered image update
      const imageFolders = {
        'Culture': 'Images/Culture',
        'Modularity': 'Images/Modularity',
        'Repurpose': 'Images/Repurpose'
      };
      const selectedWords = {
        'Culture': {'1': 'exterior', '2': 'Chinese', '3': 'school'},
        'Modularity': {'1': 'exhibition hall', '2': 'timber beams'},
        'Repurpose': {'1': 'brick', '2': 'park bench'}
      };
      const imageCount = 2; // Number of images per combination
      // const imageContainer = document.querySelector('.image-container img');
      
      let currentOpenMenu = null;
      const loadingOverlays = {
        'Culture': document.getElementById('loading-overlay-Culture'),
        'Modularity': document.getElementById('loading-overlay-Modularity'),
        'Repurpose': document.getElementById('loading-overlay-Repurpose')
      };

      function showLoadingOverlay(sectionId) {
        console.log('showing overlay');
        loadingOverlays[sectionId].style.display = 'flex';
      }

      function hideLoadingOverlay(sectionId) {
        loadingOverlays[sectionId].style.display = 'none';
      }

      function updateImage(sectionId) {
        console.log('updateImage() function called');
          const words = selectedWords[sectionId];

          const word1 = words['1'];
          const word2 = words['2'];
          const word3 = words['3'];
          if (word1 && word2) {
            console.log('Words are present:', word1, word2, word3);
            // const randomImageNumber = Math.floor(Math.random() * imageCount) + 1;
            const imagePath = word3
              ? `${imageFolders[sectionId]}/${word1}/${word2}/${word3}/1.jpg`
              : `${imageFolders[sectionId]}/${word1}/${word2}/1.jpg`;
            showLoadingOverlay(sectionId);
            console.log('imagepath:',imagePath);
            setTimeout(() => {
                console.log(`${sectionId}`);
                document.getElementById(`displayedImage${sectionId}`).src = imagePath;
                hideLoadingOverlay(sectionId);
            }, 1000); // Delay of 1 second
          }
      }

      function toggleDropdown(event) {
          const trigger = event.currentTarget;
          const triggerId = trigger.getAttribute('data-trigger');
          const sectionElement = trigger.closest('.section');
          const sectionId = sectionElement ? sectionElement.id : null;
          console.log('Dropdown trigger clicked in section:', sectionId);
          const dropdownMenu = sectionElement.querySelector(`.dropdown-menu[data-menu="${triggerId}"]`);
          // Close the currently open menu if it is not the same as the one being toggled
          if (currentOpenMenu && currentOpenMenu !== dropdownMenu) {
              currentOpenMenu.style.display = 'none';
          }
          const rect = trigger.getBoundingClientRect();
          dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`;
          dropdownMenu.style.left = `${rect.left + window.scrollX}px`;
          dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
          currentOpenMenu = dropdownMenu.style.display === 'block' ? dropdownMenu : null;

          event.stopPropagation();
      }

      function hideDropdown(event) {
        if (currentOpenMenu && !currentOpenMenu.contains(event.target) && !event.target.classList.contains('dropdown-trigger')) {
            currentOpenMenu.style.display = 'none';
            currentOpenMenu = null;
        }
      }

      document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
          trigger.addEventListener('click', toggleDropdown);
      });

      document.addEventListener('click', hideDropdown);

      document.querySelectorAll('.dropdown-menu ul').forEach(menu => {
          menu.addEventListener('click', function(event) {
            const sectionElement = menu.closest('.section');
            const sectionId = sectionElement ? sectionElement.id : null;
            isDropdownChange = true;
              if (event.target.tagName === 'LI') {
                  const word = event.target.getAttribute('data-word');
                  console.log(word);
                  const triggerId = menu.parentNode.getAttribute('data-menu');
                  console.log(sectionId);
                  const trigger = sectionElement.querySelector(`.dropdown-trigger[data-trigger="${triggerId}"]`);
                  if (!trigger) {
                    console.error('Trigger element not found.');
                    return;
                  }
                  const previousWord = trigger.textContent.trim();
                  selectedWords[sectionId][triggerId] = word;
                  console.log('selectedWords:', selectedWords[sectionId]);

                  trigger.innerHTML = `${word} <i class="fa fa-caret-down"></i>`;
                  const list = menu.querySelectorAll(`li`);
                  console.log('list:',list);

                  const liToSwap = Array.from(list)
                  .find(li => li.textContent.trim() === word);
                  console.log('swapping list:', liToSwap);

            
                  if (liToSwap) {
                    liToSwap.textContent = previousWord;
                    liToSwap.setAttribute('data-word', previousWord);
                  }     

                  updateImage(sectionId);
                  menu.parentNode.style.display = 'none';
                  currentOpenMenu = null;
              }
          });
      });

      document.querySelectorAll('.zoom-icon').forEach(zoomIcon => {
        // Handle zoom icon click
        zoomIcon.addEventListener('click', (e) => {
          const sectionId = e.currentTarget.getAttribute('data-section');
          console.log(e.currentTarget);
          console.log(sectionId);
          const imageContainer = document.querySelector(`#${sectionId} .image-container img`);
          console.log(imageContainer);
          const zoomedImageContainer = document.createElement('div');
          zoomedImageContainer.classList.add('zoomed-image-container');

          const zoomedImage = document.createElement('img');
          zoomedImage.src = imageContainer.src;
          
          const zoomedIconContainer = document.createElement('div');
          zoomedIconContainer.classList.add('zoomed-icon-container');

          const zoomOutIcon = document.createElement('i');
          zoomOutIcon.classList.add('fa', 'fa-search-minus');

          const downloadIconZoomed = document.createElement('i');
          downloadIconZoomed.classList.add('fa', 'fa-download');

          zoomedIconContainer.appendChild(zoomOutIcon);
          zoomedIconContainer.appendChild(downloadIconZoomed);

          zoomedImageContainer.appendChild(zoomedImage);
          zoomedImageContainer.appendChild(zoomedIconContainer);
          document.body.appendChild(zoomedImageContainer);

          // Event listener to close zoomed image
          zoomOutIcon.addEventListener('click', () => {
              document.body.removeChild(zoomedImageContainer);
          });

          // Add event listener to close zoomed image
          zoomedImageContainer.addEventListener('click', () => {
              document.body.removeChild(zoomedImageContainer);
          });
          // Event listener to download zoomed image
          downloadIconZoomed.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = zoomedImage.src;
            link.download = '${imageFolders[sectionId]}${word1}${word2}${word3}.jpg';
            link.click();
          });
        });      
      });

      document.querySelectorAll('.download-icon').forEach(downloadIcon =>{
        // Handle download icon click
        downloadIcon.addEventListener('click', (e) => {
          const sectionId = e.currentTarget.getAttribute('data-section');
          const imageContainer = document.querySelector(`#${sectionId} .image-container img`);
          const link = document.createElement('a');
          link.href = imageContainer.src;
          link.download = '${imageFolders[sectionId]}${word1}${word2}${word3}.jpg';
          link.click();
        });
      });
      document.querySelectorAll('.reload-icon').forEach(reloadIcon =>{
        // Handle reload icon click
        reloadIcon.addEventListener('click', (e) => {
          const sectionId = e.currentTarget.getAttribute('data-section');
          const imageContainer = document.querySelector(`#${sectionId} .image-container img`);
          showLoadingOverlay(sectionId)
          const imageSrc = imageContainer.src;
          const newImageSrc = imageSrc.includes('1') ? imageSrc.replace('1', '2') : imageSrc.replace('2', '1');
          setTimeout(() => {
            imageContainer.src = newImageSrc;
            hideLoadingOverlay(sectionId);
          }, 1000); // Delay of 1 second
        });
      });

      const scrollButtons = document.querySelectorAll('.next-button');

      scrollButtons.forEach(button => {
          button.addEventListener('click', function() {
              const targetSection = document.querySelector(button.getAttribute('data-target'));
              if (targetSection) {
                  targetSection.scrollIntoView({ behavior: 'smooth' });
              }
          });
      });

    const collageContainer = document.getElementById('collage-container');

    // Number of images you have
    const numberOfImages = 70; // Adjust this number as needed

    // Folder path where images are stored
    const folderPath = 'Images/BTS/';

    // Loop through the number of images and create img elements
    for (let i = 1; i <= numberOfImages; i++) {
        const img = document.createElement('img');
        img.src = `${folderPath}${i}.jpg`;
        img.alt = `Image ${i}`;
        img.classList.add('collage-image');
        collageContainer.appendChild(img);
    }
    const collageContainerPP = document.getElementById('collage-container-PP');

    // Number of images you have
    const numberOfImagesPP = 4; // Adjust this number as needed

    // Folder path where images are stored
    const folderPathPP = 'Images/PostProcessing/CoffeeTable'; 

    // Loop through the number of images and create img elements
    for (let i = 1; i <= numberOfImagesPP; i++) {
        const img = document.createElement('img');
        img.src = `${folderPathPP}/${i}.jpg`;
        img.alt = `Image ${i}`;
        img.classList.add('collage-image');
        collageContainerPP.appendChild(img);
    }
    
  });
