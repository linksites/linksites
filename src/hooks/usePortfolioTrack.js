import { useEffect, useRef, useState } from "react";

export function usePortfolioTrack() {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const trackRef = useRef(null);
  const dragStateRef = useRef({
    isPointerDown: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
  });

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const updateScrollState = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 8);
      setCanScrollPrev(track.scrollLeft > 8);
      setCanScrollNext(track.scrollLeft < maxScroll);
    };

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollCases(direction) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector("[data-case-card='true']");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const amount = Math.max(340, Math.round(cardWidth || track.clientWidth * 0.72));
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  function handleTrackPointerDown(event) {
    const track = trackRef.current;

    if (!track || event.pointerType !== "mouse") {
      return;
    }

    if (event.target.closest("a, button")) {
      return;
    }

    dragStateRef.current = {
      isPointerDown: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };

    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  }

  function handleTrackPointerMove(event) {
    const track = trackRef.current;
    const dragState = dragStateRef.current;

    if (!track || !dragState.isPointerDown || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 6) {
      dragStateRef.current.moved = true;
    }

    track.scrollLeft = dragState.startScrollLeft - deltaX;
  }

  function handleTrackPointerUp(event) {
    const track = trackRef.current;
    const dragState = dragStateRef.current;

    if (!track || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current.isPointerDown = false;
    dragStateRef.current.pointerId = null;

    track.classList.remove("is-dragging");

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      dragStateRef.current.moved = false;
    }, 0);
  }

  function handleTrackClickCapture(event) {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleTrackWheel(event) {
    const track = trackRef.current;

    if (!track || window.innerWidth < 1024) {
      return;
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    track.scrollLeft += event.deltaY;
  }

  return {
    canScrollPrev,
    canScrollNext,
    handleTrackClickCapture,
    handleTrackPointerDown,
    handleTrackPointerMove,
    handleTrackPointerUp,
    handleTrackWheel,
    scrollCases,
    trackRef,
  };
}
