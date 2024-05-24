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
      const imageFolder = 'Images_Culture';
      const selectedWords = {'1': 'exterior', '2': 'Chinese', '3': 'school'};
      const imageCount = 2; // Number of images per combination
      const imageContainer = document.querySelector('.image-container img');
      const zoomIcon = document.querySelector('.zoom-icon');
      const downloadIcon = document.querySelector('.download-icon');
      const reloadIcon = document.querySelector('.reload-icon');
      let currentOpenMenu = null;

      function updateImage() {
          const word1 = selectedWords['1'];
          const word2 = selectedWords['2'];
          const word3 = selectedWords['3'];
          if (word1 && word2 && word3) {
              // Generate a random number between 1 and imageCount
              const randomImageNumber = Math.floor(Math.random() * imageCount) + 1;
              const imagePath = `${imageFolder}/${word1}/${word2}/${word3}/${randomImageNumber}.jpg`;
              document.getElementById('displayedImage').src = imagePath;
          }
      }

      function toggleDropdown(event) {
          const trigger = event.currentTarget;
          const triggerId = trigger.getAttribute('data-trigger');
          const dropdownMenu = document.querySelector(`.dropdown-menu[data-menu="${triggerId}"]`);
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
              if (event.target.tagName === 'LI') {
                  const word = event.target.getAttribute('data-word');
                  const triggerId = menu.parentNode.getAttribute('data-menu');
                  const trigger = document.querySelector(`.dropdown-trigger[data-trigger="${triggerId}"]`);
                  const previousWord = trigger.textContent.trim();
                  selectedWords[triggerId] = word;

                  trigger.innerHTML = `${word} <i class="fa fa-caret-down"></i>`;

                  const liToSwap = Array.from(menu.children).find(li => li.textContent.trim() === word);
                  liToSwap.textContent = previousWord;
                  liToSwap.setAttribute('data-word', previousWord);

                  updateImage();
                  menu.parentNode.style.display = 'none';
                  currentOpenMenu = null;
              }
          });
      });

      // Handle zoom icon click
      zoomIcon.addEventListener('click', () => {
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
            link.download = `${imageFolder}${word1}${word2}${word3}${randomImageNumber}.jpg`;
            link.click();
        });
      });

      // Handle download icon click
      downloadIcon.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = imageContainer.src;
        link.download = 'downloaded_image.jpg';
        link.click();
      });

      // Handle reload icon click
      reloadIcon.addEventListener('click', () => {
        const imageSrc = imageContainer.src;
        const newImageSrc = imageSrc.includes('_1') ? imageSrc.replace('_1', '_2') : imageSrc.replace('_2', '_1');
        imageContainer.src = newImageSrc;
      });
  });
