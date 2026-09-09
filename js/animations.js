document.addEventListener('DOMContentLoaded', () => {
  const experienceVideo = document.querySelector('.experience-video-wrap video');
  const experienceVideoSources = experienceVideo ? [
    experienceVideo.dataset.videoConstrucao,
    experienceVideo.dataset.videoEventos,
    experienceVideo.dataset.videoArquitetura,
    experienceVideo.dataset.videoEmpresarial,
    experienceVideo.dataset.videoFpv,
  ] : [];
  let activeExperienceVideo = -1;

  const applyExperienceVideoRotation = (index) => {
    if (!experienceVideo || !window.gsap) return;
    window.gsap.set(experienceVideo, {
      rotation: index === 2 ? 0 : -90,
      scale: index === 2 ? 1.05 : 1.55,
    });
  };

  const setExperienceVideo = (index) => {
    if (!experienceVideo || !experienceVideoSources[index] || activeExperienceVideo === index) return;

    activeExperienceVideo = index;
    applyExperienceVideoRotation(index);
    experienceVideo.src = experienceVideoSources[index];
    experienceVideo.load();
    experienceVideo.play().catch(() => {});
  };

  setExperienceVideo(0);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  applyExperienceVideoRotation(activeExperienceVideo);

  ScrollTrigger.create({
    trigger: '.experience-scroll',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const videoIndex = Math.min(
        experienceVideoSources.length - 1,
        Math.floor(self.progress * experienceVideoSources.length)
      );
      setExperienceVideo(videoIndex);
    },
  });

  gsap.from('.hero-copy > *', {
    y: 30,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: 'power3.out',
  });

  gsap.to('.experience-video-wrap video', {
    filter: 'blur(1px) contrast(1.08)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.experience-scroll',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  const experienceImmersiveScale = window.innerWidth <= 820 ? 1.24 : 1.55;

  gsap.timeline({
    scrollTrigger: {
      trigger: '.experience-scroll',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  })
    .to('.experience-stage', {
      borderRadius: 0,
      scale: experienceImmersiveScale,
      duration: 0.48,
      ease: 'power2.inOut',
    }, 0.14)
    .to('.experience-stage', {
      borderRadius: 30,
      scale: 1,
      duration: 0.32,
      ease: 'power2.inOut',
    }, 1.08);

  const scrollWords = gsap.utils.toArray('.scroll-word');
  const wordTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.experience-scroll',
      start: 'top 35%',
      end: 'bottom 65%',
      scrub: true,
    },
  });

  scrollWords.forEach((word) => {
    wordTimeline.to(word, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: 'power2.out',
    });
    wordTimeline.to({}, { duration: 0.7 });
    wordTimeline.to(word, {
      opacity: 0,
      filter: 'blur(16px)',
      y: -20,
      scale: 0.96,
      duration: 0.45,
      ease: 'power2.in',
    });
  });

  gsap.utils.toArray('.project-scene').forEach((scene, index) => {
    const media = scene.querySelector('.project-media');
    const copy = scene.querySelector('.project-copy');

    gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    })
      .fromTo(
        media,
        { scale: 0.9, filter: 'blur(8px)', y: 40 },
        { scale: 1.5, filter: 'blur(0px) saturate(1.25)', y: -30, duration: 1 }
      )
      .fromTo(
        copy,
        { opacity: 0, y: 54, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1 },
        0.15
      );

    gsap.fromTo(
      scene,
      { x: index % 2 === 0 ? -34 : 34, y: 24 },
      {
        x: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: scene,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  const categorySection = document.querySelector('#categorias');
  if (categorySection) {
    const categoryHeader = categorySection.querySelector('.section-header');
    const categoryCards = gsap.utils.toArray('#categorias .category-item');

    gsap.from(categoryHeader, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: categorySection,
        start: 'top 76%',
        once: true,
      },
    });

    gsap.from(categoryCards, {
      y: 42,
      scale: 0.94,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: categorySection,
        start: 'top 68%',
        once: true,
      },
    });

    categoryCards.forEach((card, index) => {
      const video = card.querySelector('.category-video');
      if (!video) return;

      gsap.to(video, {
        yPercent: index % 2 === 0 ? -4 : 4,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  gsap.utils.toArray('.process-item').forEach((item, index) => {
    gsap.from(item, {
      y: 30,
      opacity: 0,
      duration: 0.75,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
    });
  });

  const diffWords = gsap.utils.toArray('.diff-word');
  gsap.timeline({
    scrollTrigger: {
      trigger: '.differential',
      start: 'top 70%',
      end: 'bottom 40%',
      scrub: true,
    },
  }).fromTo(
    diffWords,
    { opacity: 0.15, y: 30 },
    { opacity: 1, y: 0, stagger: 0.25, duration: 0.7, ease: 'power2.out' }
  );

  gsap.to('.final-cta video', {
    scale: 1.38,
    x: '-5%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.final-cta',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.cta-inner', {
    y: -20,
    opacity: 1,
    scrollTrigger: {
      trigger: '.final-cta',
      start: 'top 75%',
      end: 'bottom center',
      scrub: true,
    },
  });

  ScrollTrigger.refresh();
});
