document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const body = document.body;
    const html = document.documentElement;
    let scrollY = 0;

    let scale = 1, startDistance = 0, lastScale = 1;
    let isZoomed = false;

    // Open modal
    document.querySelectorAll(".flyer").forEach(img => {
        img.addEventListener("click", () => {
            modalImg.src = img.dataset.src;
            modal.style.display = "flex";
            setTimeout(() => modal.classList.add("show"), 10);
            history.pushState({ modalOpen: true }, "");
            disableBackgroundScroll();
            resetZoom();
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
            enableBackgroundScroll();
        }, 300);
        resetZoom();
        history.back();
    }

    // Close modal when clicking outside image
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });

    // Close modal on "Esc" key (desktop)
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    // Handle browser "Back" button
    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.modalOpen) closeModal();
    });

    // Disable background scrolling while preserving scroll position
    function disableBackgroundScroll() {
        scrollY = window.scrollY;
        background = body.style.background;
        body.style.background = "#000";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overflow = "hidden";
    }

    // Re-enable background scrolling and restore position
    function enableBackgroundScroll() {
        body.style.position = "";
        body.style.top = "";
        body.style.width = "";
        body.style.overflow = "";
        html.style.overflow = "";
        window.scrollTo(0, scrollY);
        body.style.background = background;
    }

    // Mouse wheel zoom (desktop)
    modalImg.addEventListener("wheel", (event) => {
        event.preventDefault();
        let delta = event.deltaY * -0.0015;
        scale = Math.min(Math.max(1, scale + delta), 3);
        isZoomed = scale > 1;
        applyTransform();
    });

    // Touch zoom (pinch)
    modalImg.addEventListener("touchstart", (event) => {
        if (event.touches.length === 2) {
            startDistance = getDistance(event.touches);
            lastScale = scale;
        }
    });

    modalImg.addEventListener("touchmove", (event) => {
        if (event.touches.length === 2) {
            event.preventDefault();
            let newDistance = getDistance(event.touches);
            scale = Math.min(Math.max(1, lastScale * (newDistance / startDistance)), 3);
            isZoomed = scale > 1;
            applyTransform();
        }
    });

    // Disable dragging
    modalImg.addEventListener("dragstart", (event) => event.preventDefault());

    // Apply zoom transformations
    function applyTransform() {
        modalImg.style.transform = `scale(${scale})`;
        modalImg.style.overflow = isZoomed ? "scroll" : "hidden";
        modal.style.overflow = isZoomed ? "auto" : "hidden";
    }

    // Reset zoom when closing
    function resetZoom() {
        scale = 1;
        isZoomed = false;
        applyTransform();
    }

    // Get distance between two touch points
    function getDistance(touches) {
        let dx = touches[0].clientX - touches[1].clientX;
        let dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});
