import {
  createTimeline,
  stagger,
  createMotionPath,
  type AnimationParams,
  type Timeline,
} from 'animejs';

type SceneAnimation = {
  root: HTMLElement;
  timeline: Timeline;
};

type Cleanup = () => void;

declare global {
  interface Window {
    __spaceStoryCleanup?: Cleanup;
  }
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const select = (root: HTMLElement, selector: string) =>
  Array.from(root.querySelectorAll<HTMLElement | SVGElement>(selector));

const add = (
  timeline: Timeline,
  targets: Array<HTMLElement | SVGElement>,
  parameters: AnimationParams,
  position: number | string = 0
) => {
  if (targets.length === 0) return;
  timeline.add(targets, parameters, position);
};

const baseTimeline = () =>
  createTimeline({
    autoplay: false,
    defaults: {
      duration: 1000,
      ease: 'outExpo',
    },
  });

const createMoonlitBedroomTimeline = (root: HTMLElement) => {
  const timeline = createTimeline({
    autoplay: false,
    defaults: {
      duration: 600,
      ease: 'linear',
    },
  });

  timeline
    .label('closed', 0)
    .label('breach', 300)
    .label('unfold', 600)
    .label('threshold', 1240)
    .label('awe', 2160)
    .label('end', 2400);

  add(
    timeline,
    select(root, "[data-anim='stars-far']"),
    {
      opacity: [0.2, 0.42],
      scale: [0.98, 1],
      translateY: [2, 0],
      duration: 600,
    },
    'closed'
  );

  add(
    timeline,
    select(root, "[data-anim='window-seam']"),
    {
      opacity: [0.18, 0.64],
      strokeDashoffset: [70, 0],
      duration: 300,
      ease: 'outQuart',
    },
    'closed'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-disc']"),
    {
      opacity: [0.58, 0.64],
      translateY: [34, 30],
      scale: [0.74, 0.82],
      duration: 300,
      ease: 'inOutSine',
    },
    'closed'
  );

  add(
    timeline,
    select(root, "[data-anim='sash-left']"),
    {
      scaleX: [1, 0.72],
      rotate: [0, -0.6],
      duration: 300,
      ease: 'inOutSine',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='sash-right']"),
    {
      scaleX: [1, 0.72],
      rotate: [0, 0.6],
      duration: 300,
      ease: 'inOutSine',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='latch-left']"),
    {
      translateX: [0, -18],
      rotate: [0, -12],
      opacity: [1, 0.24],
      duration: 300,
      ease: 'outQuart',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='latch-right']"),
    {
      translateX: [0, 18],
      rotate: [0, 12],
      opacity: [1, 0.24],
      duration: 300,
      ease: 'outQuart',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='window-seam']"),
    {
      opacity: [0.64, 0],
      duration: 300,
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-disc']"),
    {
      opacity: [0.64, 0.78],
      translateY: [30, 20],
      scale: [0.82, 0.94],
      duration: 300,
      ease: 'inOutSine',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-halo']"),
    {
      opacity: [0.04, 0.16],
      scale: [0.86, 1],
      duration: 300,
      ease: 'inOutSine',
    },
    'breach'
  );

  add(
    timeline,
    select(root, "[data-anim='sash-left']"),
    {
      scaleX: [0.72, 0.12],
      rotate: [-0.6, -1.5],
      opacity: [1, 0.68],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='sash-right']"),
    {
      scaleX: [0.72, 0.12],
      rotate: [0.6, 1.5],
      opacity: [1, 0.68],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='curtain-left']"),
    {
      translateX: [0, -42],
      scaleX: [1, 0.54],
      opacity: [1, 0.82],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='curtain-right']"),
    {
      translateX: [0, 42],
      scaleX: [1, 0.54],
      opacity: [1, 0.82],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='curtain-fold-left']"),
    {
      translateX: [0, -8],
      rotate: [0, -0.7],
      delay: stagger(32),
      duration: 440,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='curtain-fold-right']"),
    {
      translateX: [0, 8],
      rotate: [0, 0.7],
      delay: stagger(32),
      duration: 440,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='moonbeam']"),
    {
      opacity: [0, 0.32],
      translateY: [24, 0],
      scaleX: [0.08, 1],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='dust'] > *"),
    {
      opacity: [0, 0.48],
      translateX: [-4, 4],
      translateY: [20, -8],
      delay: stagger(12, { from: 'center' }),
      duration: 500,
      ease: 'outQuart',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='stars-near']"),
    {
      opacity: [0.04, 0.9],
      scale: [0.84, 1],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='star-bursts']"),
    {
      opacity: [0.04, 0.78],
      scale: [0.84, 1],
      duration: 520,
      ease: 'outQuart',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-disc']"),
    {
      opacity: [0.78, 1],
      translateY: [20, 10],
      scale: [0.94, 1.16],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-halo']"),
    {
      opacity: [0.16, 0.3],
      scale: [1, 1.08],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-relief']"),
    {
      translateY: [4, -2],
      scale: [0.98, 1],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-terminator']"),
    {
      translateX: [-8, 12],
      opacity: [0.36, 0.18],
      duration: 640,
      ease: 'inOutSine',
    },
    'unfold'
  );

  add(
    timeline,
    select(root, "[data-anim='vignette']"),
    {
      opacity: [0.76, 0.32],
      duration: 1240,
      ease: 'inOutSine',
    },
    'closed'
  );

  add(
    timeline,
    select(root, "[data-anim='room-camera']"),
    {
      scale: [1, 5.2],
      opacity: [1, 0],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='foreground']"),
    {
      translateY: [0, 72],
      scale: [1, 1.18],
      duration: 760,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='dust'] > *"),
    {
      opacity: [0.48, 0],
      translateY: [-8, -26],
      delay: stagger(10, { from: 'center' }),
      duration: 520,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='stars-far']"),
    {
      opacity: [0.42, 0.82],
      translateY: [0, -6],
      scale: [1, 1.05],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='stars-near']"),
    {
      opacity: [0.9, 1],
      translateY: [0, -18],
      scale: [1, 1.14],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-disc']"),
    {
      translateY: [10, 0],
      scale: [1.16, 1.62],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-halo']"),
    {
      opacity: [0.3, 0.56],
      scale: [1.08, 1.35],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='vignette']"),
    {
      opacity: [0.32, 0.08],
      duration: 920,
      ease: 'inOutSine',
    },
    'threshold'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-disc']"),
    {
      scale: [1.62, 1.66],
      duration: 240,
      ease: 'inOutSine',
    },
    'awe'
  );

  add(
    timeline,
    select(root, "[data-anim='moon-halo']"),
    {
      opacity: [0.56, 0.48],
      scale: [1.35, 1.32],
      duration: 240,
      ease: 'inOutSine',
    },
    'awe'
  );

  add(
    timeline,
    select(root, "[data-anim='star-bursts']"),
    {
      opacity: [0.78, 0.86],
      duration: 240,
      ease: 'inOutSine',
    },
    'awe'
  );

  return timeline;
};

const createBlueprintsTimeline = (root: HTMLElement) => {
  const timeline = baseTimeline();

  add(
    timeline,
    select(root, "[data-anim='paper-note']"),
    { translateY: [20, 0], rotate: [-2, 0], opacity: [0.72, 1], delay: stagger(100) },
    0
  );
  add(
    timeline,
    select(root, "[data-anim='table']"),
    { translateY: [22, 0], opacity: [0.72, 1] },
    150
  );
  add(
    timeline,
    select(root, "[data-anim='blueprint-line']"),
    {
      strokeDashoffset: [220, 0],
      opacity: [0.34, 1],
      duration: 2000,
      delay: stagger(120),
      ease: 'outQuart',
    },
    250
  );

  return timeline;
};

const createSaturnVLaunchTimeline = (root: HTMLElement) => {
  const timeline = createTimeline({
    autoplay: false,
    defaults: {
      duration: 1600,
      ease: 'linear',
    },
  });

  const pathElement = select(root, "[data-anim='arc-path']")[0];
  if (pathElement) {
    const path = createMotionPath(pathElement);

    add(
      timeline,
      select(root, "[data-anim='green-circle']"),
      {
        translateX: path.translateX,
        translateY: path.translateY,
        rotate: path.rotate,
        duration: 1600,
        ease: 'linear',
      },
      0
    );

    add(
      timeline,
      [pathElement],
      {
        strokeDashoffset: [600, 0],
        duration: 1600,
        ease: 'linear',
      },
      0
    );
  }

  return timeline;
};

const createMoonLandingTimeline = (root: HTMLElement) => {
  const timeline = baseTimeline();

  add(
    timeline,
    select(root, "[data-anim='star']"),
    { translateX: [15, -15], ease: 'linear', duration: 1000 },
    0
  );
  add(
    timeline,
    select(root, "[data-anim='earth']"),
    { translateX: [60, -60], ease: 'linear', duration: 1000 },
    0
  );
  add(
    timeline,
    select(root, "[data-anim='moon-hill-back']"),
    { translateX: [100, -100], ease: 'linear', duration: 1000 },
    0
  );
  add(
    timeline,
    select(root, "[data-anim='moon-hill-mid']"),
    { translateX: [150, -170], ease: 'linear', duration: 1000 },
    0
  );
  add(
    timeline,
    select(root, "[data-anim='moon-hill-front']"),
    { translateX: [200, -260], ease: 'linear', duration: 1000 },
    0
  );

  add(
    timeline,
    select(root, "[data-anim='star'] > circle"),
    { opacity: [0.18, 1], scale: [0.6, 1], delay: stagger(60), duration: 600 },
    0
  );

  add(
    timeline,
    select(root, "[data-anim='earth']"),
    { scale: [0.85, 1], opacity: [0.6, 1], duration: 800 },
    0
  );

  add(
    timeline,
    select(root, "[data-anim='flag']"),
    { rotate: [-3, 0], translateY: [12, 0], opacity: [0.5, 1], duration: 500 },
    300
  );

  return timeline;
};

const createSceneTimeline = (root: HTMLElement) => {
  switch (root.dataset.scene) {
    case 'moonlit-bedroom':
      return createMoonlitBedroomTimeline(root);
    case 'blueprints':
      return createBlueprintsTimeline(root);
    case 'saturn-v-launch':
      return createSaturnVLaunchTimeline(root);
    case 'moon-landing':
      return createMoonLandingTimeline(root);
    default:
      return baseTimeline();
  }
};

const getLocalProgress = (root: HTMLElement) => {
  const rect = root.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
};

const getPinnedProgress = (root: HTMLElement) => {
  const rect = root.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const stickyHeight =
    root.querySelector<HTMLElement>('.space-story__art')?.getBoundingClientRect().height ??
    viewportHeight;
  const pinDistance = Math.max(rect.height - stickyHeight, 1);
  const entryEndProgress = 0.6;

  // Play through the closed and breach phases while the artwork enters the viewport.
  // The unfold phase begins exactly when the full-height artwork becomes pinned.
  if (rect.top > 0) {
    return clamp((1 - rect.top / viewportHeight) * entryEndProgress);
  }

  return clamp(entryEndProgress + (-rect.top / pinDistance) * (1 - entryEndProgress));
};

const getSceneProgress = (root: HTMLElement) => {
  if (root.dataset.scene === 'moonlit-bedroom') {
    return getPinnedProgress(root);
  }

  const rawProgress = getLocalProgress(root);
  if (root.dataset.scene === 'blueprints') {
    return rawProgress < 0.2 ? 0 : rawProgress > 0.6 ? 1 : (rawProgress - 0.2) / 0.4;
  }
  if (root.dataset.scene === 'saturn-v-launch') {
    return rawProgress < 0.15 ? 0 : rawProgress > 0.95 ? 1 : (rawProgress - 0.15) / 0.8;
  }
  if (root.dataset.scene === 'moon-landing') {
    return rawProgress < 0.1 ? 0 : rawProgress > 0.9 ? 1 : (rawProgress - 0.1) / 0.8;
  }
  return rawProgress;
};

export const initSpaceStoryAnimator = () => {
  if (typeof window === 'undefined') return () => {};

  window.__spaceStoryCleanup?.();

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-space-story]'));
  const reduceMotion = window.matchMedia(reducedMotionQuery);

  if (roots.length === 0) return () => {};

  const handleMotionPreferenceChange = () => initSpaceStoryAnimator();
  reduceMotion.addEventListener('change', handleMotionPreferenceChange);

  if (reduceMotion.matches) {
    roots.forEach((root) => root.classList.add('is-motion-reduced'));

    const staticCleanup = () => {
      document.removeEventListener('astro:before-swap', staticCleanup);
      reduceMotion.removeEventListener('change', handleMotionPreferenceChange);
      roots.forEach((root) => root.classList.remove('is-motion-reduced'));
      window.__spaceStoryCleanup = undefined;
    };

    document.addEventListener('astro:before-swap', staticCleanup, { once: true });
    window.__spaceStoryCleanup = staticCleanup;
    return staticCleanup;
  }

  const scenes = roots.map((root) => {
    const timeline = createSceneTimeline(root);
    timeline.pause();
    timeline.seek(timeline.duration * getSceneProgress(root), true);

    return { root, timeline };
  });

  const sceneByRoot = new Map<HTMLElement, SceneAnimation>(
    scenes.map((scene) => [scene.root, scene])
  );
  const activeScenes = new Set<SceneAnimation>();
  let frame = 0;

  const renderActiveScenes = () => {
    frame = 0;
    activeScenes.forEach((scene) => {
      const duration = Math.max(scene.timeline.duration, 1);
      scene.timeline.seek(duration * getSceneProgress(scene.root), true);
    });
  };

  const scheduleRender = () => {
    if (activeScenes.size > 0 && frame === 0) {
      frame = window.requestAnimationFrame(renderActiveScenes);
    }
  };

  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', scheduleRender);
  window.visualViewport?.addEventListener('resize', scheduleRender);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const root = entry.target as HTMLElement;
        const scene = sceneByRoot.get(root);
        if (!scene) return;

        if (entry.isIntersecting) {
          activeScenes.add(scene);
          root.classList.add('is-space-story-active');
          scheduleRender();
          return;
        }

        activeScenes.delete(scene);
        root.classList.remove('is-space-story-active');
        const duration = Math.max(scene.timeline.duration, 1);
        scene.timeline.seek(duration * getSceneProgress(root), true);
      });
    },
    { threshold: 0 }
  );

  scenes.forEach(({ root }) => observer.observe(root));

  const cleanup = () => {
    document.removeEventListener('astro:before-swap', cleanup);
    observer.disconnect();
    reduceMotion.removeEventListener('change', handleMotionPreferenceChange);
    window.removeEventListener('scroll', scheduleRender);
    window.removeEventListener('resize', scheduleRender);
    window.visualViewport?.removeEventListener('resize', scheduleRender);
    if (frame !== 0) window.cancelAnimationFrame(frame);
    scenes.forEach(({ root, timeline }) => {
      root.classList.remove('is-space-story-active');
      timeline.revert();
    });
    window.__spaceStoryCleanup = undefined;
  };

  document.addEventListener('astro:before-swap', cleanup, { once: true });
  window.__spaceStoryCleanup = cleanup;

  return cleanup;
};
