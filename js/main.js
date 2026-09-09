document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fpvCursor = document.querySelector('.fpv-cursor');
  if (fpvCursor && !window.matchMedia('(pointer: coarse)').matches && !prefersReducedMotion) {
    document.addEventListener('pointermove', (event) => {
      fpvCursor.style.left = `${event.clientX}px`;
      fpvCursor.style.top = `${event.clientY}px`;
      fpvCursor.classList.add('is-visible');
      fpvCursor.classList.toggle('is-on-orange', Boolean(event.target.closest('.fpv-section, .projects')));
    });

    document.addEventListener('pointerover', (event) => {
      if (event.target.closest('a, button, input, [role="button"]')) {
        fpvCursor.classList.add('is-hovering');
      }
    });
    document.addEventListener('pointerout', (event) => {
      if (event.target.closest('a, button, input, [role="button"]')) {
        fpvCursor.classList.remove('is-hovering');
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (event.target.closest('a, button, input, [role="button"]')) {
        fpvCursor.classList.add('is-pressing');
      }
    });

    document.addEventListener('pointerup', () => {
      fpvCursor.classList.remove('is-pressing');
    });
  }

  if (!prefersReducedMotion && window.Lenis) {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      lerp: 0.06,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  const particleCanvas = document.querySelector('.particle-field');
  if (particleCanvas) {
    const particleContext = particleCanvas.getContext('2d');
    const pointer = { x: -1000, y: -1000 };
    const particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let devicePixelRatio = 1;

    const resizeParticleField = () => {

  document.querySelectorAll('.project-media video').forEach((video) => {
    const media = video.closest('.project-media');

    const fitProjectVideo = () => {
      if (!media || !video.videoWidth || !video.videoHeight) return;

      const isPortrait = video.videoHeight > video.videoWidth;
      if (!isPortrait) {
        video.style.removeProperty('width');
        video.style.removeProperty('height');
        video.style.removeProperty('left');
        video.style.removeProperty('top');
        video.style.removeProperty('right');
        video.style.removeProperty('bottom');
        video.style.removeProperty('transform');
        return;
      }

      const mediaBounds = media.getBoundingClientRect();
      video.style.width = `${mediaBounds.height}px`;
      video.style.height = `${mediaBounds.width}px`;
      video.style.left = '50%';
      video.style.top = '50%';
      video.style.right = 'auto';
      video.style.bottom = 'auto';
      video.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
    };

    video.addEventListener('loadedmetadata', fitProjectVideo);
    new ResizeObserver(fitProjectVideo).observe(media);
  });
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      particleCanvas.width = canvasWidth * devicePixelRatio;
      particleCanvas.height = canvasHeight * devicePixelRatio;
      particleCanvas.style.width = `${canvasWidth}px`;
      particleCanvas.style.height = `${canvasHeight}px`;
      particleContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(78, Math.max(34, Math.floor((canvasWidth * canvasHeight) / 19000)));

      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          originX: Math.random() * canvasWidth,
          originY: Math.random() * canvasHeight,
          velocityX: (Math.random() - 0.5) * 0.18,
          velocityY: (Math.random() - 0.5) * 0.18,
          radius: Math.random() * 1.8 + 0.7,
          alpha: Math.random() * 0.42 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      particleContext.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((particle) => {
        const distanceX = particle.x - pointer.x;
        const distanceY = particle.y - pointer.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const interactionRadius = 150;

        if (!prefersReducedMotion) {
          if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            const safeDistance = Math.max(distance, 1);
            particle.velocityX += (distanceX / safeDistance) * force * 0.045;
            particle.velocityY += (distanceY / safeDistance) * force * 0.045;
          }

          particle.velocityX += (particle.originX - particle.x) * 0.00005;
          particle.velocityY += (particle.originY - particle.y) * 0.00005;
          particle.velocityX *= 0.985;
          particle.velocityY *= 0.985;
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
        }

        particleContext.beginPath();
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fillStyle = `rgba(255, 122, 53, ${particle.alpha})`;
        particleContext.shadowBlur = 12;
        particleContext.shadowColor = 'rgba(255, 90, 31, 0.45)';
        particleContext.fill();
        particleContext.shadowBlur = 0;
      });

      if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
    };

    resizeParticleField();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeParticleField();
      createParticles();
      if (prefersReducedMotion) drawParticles();
    });

    document.addEventListener('pointermove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });

    document.addEventListener('pointerleave', () => {
      pointer.x = -1000;
      pointer.y = -1000;
    });
  }

  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach((item) => {
    const image = item.dataset.image;
    if (image) item.style.setProperty('--image', `url('${image}')`);

    const video = item.querySelector('.category-video');
    if (!video) return;

    let sourceLoaded = false;
    let inViewport = false;

    const loadCategoryVideo = () => {
      if (sourceLoaded || !item.dataset.video) return;
      video.src = item.dataset.video;
      sourceLoaded = true;
      video.load();
    };

    const playCategoryVideo = () => {
      loadCategoryVideo();
      video.play().then(() => {
        item.classList.add('is-playing');
      }).catch(() => {
        item.classList.remove('is-playing');
      });
    };

    const stopCategoryVideo = () => {
      video.pause();
      video.currentTime = 0;
      item.classList.remove('is-playing');
    };

    item.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(pointer: coarse)').matches) playCategoryVideo();
    });

    item.addEventListener('mouseleave', () => {
      if (!window.matchMedia('(pointer: coarse)').matches && !inViewport) stopCategoryVideo();
    });

    item.addEventListener('click', () => {
      if (!window.matchMedia('(pointer: coarse)').matches) return;
      if (video.paused) playCategoryVideo();
      else stopCategoryVideo();
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });

    video.addEventListener('error', () => {
      item.classList.remove('is-playing');
    });

    item._categoryVideoControls = {
      loadCategoryVideo,
      playCategoryVideo,
      stopCategoryVideo,
      setInViewport: (value) => { inViewport = value; },
    };
  });

  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const controls = entry.target._categoryVideoControls;
      if (!controls) return;

      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        controls.setInViewport(true);
        controls.playCategoryVideo();
        if (window.matchMedia('(pointer: coarse)').matches) {
          controls.loadCategoryVideo();
        }
      } else {
        controls.setInViewport(false);
        controls.stopCategoryVideo();
      }
    });
  }, { threshold: 0.35 });

  categoryItems.forEach((item) => categoryObserver.observe(item));

  const categoryViewer = document.querySelector('.category-viewer');
  const categoryViewerVideo = categoryViewer?.querySelector('.category-viewer-video');
  const categoryViewerVideoShell = categoryViewer?.querySelector('.category-viewer-video-shell');
  const categoryViewerMedia = categoryViewer?.querySelector('.category-viewer-media');
  const categoryViewerTitle = categoryViewer?.querySelector('#category-viewer-title');
  const categoryViewerNumber = categoryViewer?.querySelector('.category-viewer-number');
  const categoryViewerRotate = categoryViewer?.querySelector('.category-viewer-rotate');

  if (categoryViewer && categoryViewerVideo && categoryViewerVideoShell && categoryViewerMedia && categoryViewerTitle && categoryViewerNumber && categoryViewerRotate) {
    let categoryVideoRotation = 0;
    let categoryVideoIsPortrait = false;

    const fitRotatedVideoShell = () => {
      if (categoryVideoRotation !== -90) {
        categoryViewerVideoShell.style.removeProperty('width');
        categoryViewerVideoShell.style.removeProperty('height');
        return;
      }

      const mediaBounds = categoryViewerMedia.getBoundingClientRect();
      categoryViewerVideoShell.style.width = `${mediaBounds.height}px`;
      categoryViewerVideoShell.style.height = `${mediaBounds.width}px`;
    };

    const categoryViewerResizeObserver = new ResizeObserver(fitRotatedVideoShell);
    categoryViewerResizeObserver.observe(categoryViewerMedia);

    const closeCategoryViewer = () => {
      categoryViewer.classList.remove('is-open', 'is-portrait', 'is-rotated', 'is-rotation-minus-90', 'has-fallback');
      categoryViewer.setAttribute('aria-hidden', 'true');
      categoryViewerVideo.pause();
      categoryVideoRotation = 0;
      categoryVideoIsPortrait = false;
      categoryViewerRotate.textContent = '↻ Girar';
      categoryViewerRotate.setAttribute('aria-label', 'Girar vídeo');
      categoryViewerRotate.setAttribute('aria-pressed', 'false');
      categoryViewerVideo.removeAttribute('src');
      categoryViewerVideo.removeAttribute('poster');
      categoryViewerVideo.load();
      categoryViewer.style.removeProperty('--category-video-aspect');
      categoryViewer.style.removeProperty('--category-rotated-aspect');
      document.body.style.overflow = '';
      fitRotatedVideoShell();
    };

    categoryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const source = item.dataset.video;
        const poster = item.querySelector('.category-video')?.getAttribute('poster') || item.dataset.image;
        const name = item.querySelector('.category-name')?.textContent || '';
        const number = item.querySelector('.category-number')?.textContent || '';

        categoryViewerTitle.textContent = name;
        categoryViewerNumber.textContent = number;
        categoryVideoRotation = 0;
        categoryVideoIsPortrait = false;
        categoryViewerRotate.textContent = '↻ Girar';
        categoryViewerRotate.setAttribute('aria-label', 'Girar vídeo');
        categoryViewerRotate.setAttribute('aria-pressed', 'false');
        categoryViewerVideo.poster = poster;
        categoryViewerVideo.src = source;
        categoryViewer.classList.remove('is-portrait', 'is-rotated', 'is-rotation-minus-90', 'has-fallback');
        categoryViewer.classList.add('is-open');
        categoryViewer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        categoryViewerVideo.onloadedmetadata = () => {
          const videoWidth = categoryViewerVideo.videoWidth;
          const videoHeight = categoryViewerVideo.videoHeight;

          if (videoWidth && videoHeight) {
            categoryViewer.style.setProperty('--category-video-aspect', `${videoWidth} / ${videoHeight}`);
            categoryViewer.style.setProperty('--category-rotated-aspect', `${videoHeight} / ${videoWidth}`);
          }

          categoryVideoIsPortrait = categoryViewerVideo.videoHeight > categoryViewerVideo.videoWidth;
          categoryViewer.classList.toggle('is-portrait', categoryVideoIsPortrait);
          fitRotatedVideoShell();
        };

        categoryViewerVideo.play().catch(() => {
          categoryViewer.classList.add('has-fallback');
        });
      });
    });

    categoryViewerRotate.addEventListener('click', () => {
      categoryVideoRotation = categoryVideoRotation === 0 ? -90 : 0;
      categoryViewer.classList.toggle('is-rotation-minus-90', categoryVideoRotation === -90);
      categoryViewer.classList.toggle('is-rotated', categoryVideoRotation === -90);
      categoryViewer.classList.toggle('is-portrait', categoryVideoRotation === 0 && categoryVideoIsPortrait);
      fitRotatedVideoShell();
      categoryViewerRotate.textContent = categoryVideoRotation === -90 ? '↺ Voltar' : '↻ Girar';
      categoryViewerRotate.setAttribute('aria-label', categoryVideoRotation === -90 ? 'Voltar vídeo à posição original' : 'Girar vídeo');
      categoryViewerRotate.setAttribute('aria-pressed', String(categoryVideoRotation === -90));
    });

    window.addEventListener('resize', fitRotatedVideoShell);

    categoryViewerVideo.addEventListener('error', () => categoryViewer.classList.add('has-fallback'));
    categoryViewer.querySelectorAll('[data-category-close]').forEach((control) => {
      control.addEventListener('click', closeCategoryViewer);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && categoryViewer.classList.contains('is-open')) closeCategoryViewer();
    });
  }

  const feedbackViewport = document.querySelector('.feedback-viewport');
  const feedbackTrack = document.querySelector('.feedback-wall');
  const feedbackItems = document.querySelectorAll('.feedback-print');
  const previousFeedback = document.querySelector('.feedback-arrow-prev');
  const nextFeedback = document.querySelector('.feedback-arrow-next');

  if (feedbackViewport && feedbackTrack && feedbackItems.length && previousFeedback && nextFeedback) {
    const feedbackItemCount = feedbackItems.length;
    const feedbackLoopItems = Array.from(feedbackItems).map((item) => item.cloneNode(true));
    const feedbackLoopItemsBefore = feedbackLoopItems.map((item) => item.cloneNode(true));
    feedbackLoopItemsBefore.forEach((item) => item.setAttribute('aria-hidden', 'true'));
    feedbackLoopItems.forEach((item) => item.setAttribute('aria-hidden', 'true'));
    feedbackLoopItemsBefore.reverse().forEach((item) => feedbackTrack.prepend(item));
    feedbackLoopItems.forEach((item) => feedbackTrack.append(item));

    let feedbackIndex = feedbackItemCount;
    let feedbackDragStartX = 0;
    let feedbackDragOffset = 0;
    let feedbackIsDragging = false;

    const getFeedbackMetrics = () => {
      const itemWidth = feedbackItems[0].getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(feedbackTrack).gap) || 0;

      return { itemWidth, gap, positionCount: feedbackItemCount };
    };

    const updateFeedbackCarousel = () => {
      const { itemWidth, gap, positionCount } = getFeedbackMetrics();

      feedbackTrack.style.transform = `translateX(-${feedbackIndex * (itemWidth + gap)}px)`;
      previousFeedback.disabled = positionCount <= 1;
      nextFeedback.disabled = positionCount <= 1;
    };

    previousFeedback.addEventListener('click', () => {
      feedbackIndex -= 1;
      updateFeedbackCarousel();
    });

    nextFeedback.addEventListener('click', () => {
      feedbackIndex += 1;
      updateFeedbackCarousel();
    });

    feedbackViewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      feedbackDragStartX = event.clientX;
      feedbackDragOffset = 0;
      feedbackIsDragging = true;
      feedbackTrack.classList.add('is-dragging');
      feedbackViewport.setPointerCapture(event.pointerId);
    });

    feedbackViewport.addEventListener('pointermove', (event) => {
      if (!feedbackIsDragging) return;

      const { itemWidth, gap } = getFeedbackMetrics();
      feedbackDragOffset = event.clientX - feedbackDragStartX;
      feedbackTrack.style.transform = `translateX(${(-feedbackIndex * (itemWidth + gap)) + feedbackDragOffset}px)`;
    });

    const finishFeedbackDrag = (event) => {
      if (!feedbackIsDragging) return;

      const { itemWidth, gap } = getFeedbackMetrics();
      const dragThreshold = Math.max(48, (itemWidth + gap) * 0.2);
      feedbackIsDragging = false;
      feedbackTrack.classList.remove('is-dragging');

      if (feedbackDragOffset <= -dragThreshold) {
        feedbackIndex += 1;
      } else if (feedbackDragOffset >= dragThreshold) {
        feedbackIndex -= 1;
      }

      feedbackDragOffset = 0;
      if (feedbackViewport.hasPointerCapture(event.pointerId)) feedbackViewport.releasePointerCapture(event.pointerId);
      updateFeedbackCarousel();
    };

    feedbackTrack.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'transform') return;

      if (feedbackIndex >= feedbackItemCount * 2) {
        feedbackIndex -= feedbackItemCount;
      } else if (feedbackIndex < feedbackItemCount) {
        feedbackIndex += feedbackItemCount;
      } else {
        return;
      }

      feedbackTrack.classList.add('is-resetting');
      updateFeedbackCarousel();
      requestAnimationFrame(() => feedbackTrack.classList.remove('is-resetting'));
    });

    feedbackViewport.addEventListener('pointerup', finishFeedbackDrag);
    feedbackViewport.addEventListener('pointercancel', finishFeedbackDrag);

    window.addEventListener('resize', updateFeedbackCarousel);
    updateFeedbackCarousel();
  }

  const beforeAfter = document.querySelector('[data-before-after]');
  if (beforeAfter) {
    const range = beforeAfter.querySelector('.before-after-range');
    const afterLayer = beforeAfter.querySelector('.before-after-after');
    const divider = beforeAfter.querySelector('.before-after-divider');
    const beforeVideo = beforeAfter.querySelector('.before-image');
    const afterVideo = beforeAfter.querySelector('.after-image');

    const updateBeforeAfter = () => {
      const value = `${range.value}%`;
      afterLayer.style.width = `calc(100% - ${value})`;
      divider.style.left = value;
    };

    range.addEventListener('input', updateBeforeAfter);
    updateBeforeAfter();

    let draggingComparison = false;

    const updateComparisonFromPointer = (event) => {
      const bounds = beforeAfter.getBoundingClientRect();
      const value = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
      range.value = value;
      updateBeforeAfter();
    };

    beforeAfter.addEventListener('pointerdown', (event) => {
      draggingComparison = true;
      beforeAfter.setPointerCapture(event.pointerId);
      updateComparisonFromPointer(event);
    });

    beforeAfter.addEventListener('pointermove', (event) => {
      if (draggingComparison) updateComparisonFromPointer(event);
    });

    beforeAfter.addEventListener('pointerup', (event) => {
      draggingComparison = false;
      beforeAfter.releasePointerCapture(event.pointerId);
    });

    beforeAfter.addEventListener('pointercancel', () => {
      draggingComparison = false;
    });

    document.addEventListener('pointerdown', (event) => {
      const bounds = beforeAfter.getBoundingClientRect();
      const insideComparison = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!insideComparison) return;
      draggingComparison = true;
      updateComparisonFromPointer(event);
    });

    document.addEventListener('pointermove', (event) => {
      if (draggingComparison) updateComparisonFromPointer(event);
    });

    document.addEventListener('pointerup', () => {
      draggingComparison = false;
    });

    beforeAfter.addEventListener('mousedown', (event) => {
      draggingComparison = true;
      updateComparisonFromPointer(event);
    });

    document.addEventListener('mousemove', (event) => {
      if (draggingComparison) updateComparisonFromPointer(event);
    });

    document.addEventListener('mouseup', () => {
      draggingComparison = false;
    });

    if (beforeVideo && afterVideo) {
      let syncing = false;

      const syncVideos = (source, target) => {
        if (syncing || Math.abs(source.currentTime - target.currentTime) < 0.08) return;
        syncing = true;
        target.currentTime = source.currentTime;
        syncing = false;
      };

      beforeVideo.addEventListener('timeupdate', () => syncVideos(beforeVideo, afterVideo));
      afterVideo.addEventListener('timeupdate', () => syncVideos(afterVideo, beforeVideo));

      beforeVideo.addEventListener('play', () => {
        afterVideo.play().catch(() => {});
      });
      afterVideo.addEventListener('play', () => {
        beforeVideo.play().catch(() => {});
      });

      beforeVideo.addEventListener('pause', () => {
        if (!afterVideo.paused) afterVideo.pause();
      });
      afterVideo.addEventListener('pause', () => {
        if (!beforeVideo.paused) beforeVideo.pause();
      });

      beforeVideo.addEventListener('loadedmetadata', () => {
        afterVideo.currentTime = beforeVideo.currentTime;
        afterVideo.play().catch(() => {});
      });
    }
  }

  const revealItems = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => {
    if (item.classList.contains('reveal-left')) {
      item.style.transform = 'translateX(-28px)';
    } else if (item.classList.contains('reveal-right')) {
      item.style.transform = 'translateX(28px)';
    } else {
      item.style.transform = 'translateY(30px)';
    }

    observer.observe(item);
  });

  const navigationLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const navigationSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (navigationLinks.length && navigationSections.length) {
    const updateActiveNavigation = (sectionId) => {
      navigationLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
      });
    };

    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleSection) updateActiveNavigation(visibleSection.target.id);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5, 0.8] }
    );

    navigationSections.forEach((section) => navigationObserver.observe(section));
  }
});
