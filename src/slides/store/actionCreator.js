export const dragStart = (clientX, currentBoxLeft) => ({
	type: "DRAG_START",
	clientX,
	currentBoxLeft
});

export const dragEnd = () => ({
	type: "DRAG_END"	
});

export const init = (width, sum, initBoxLeft) =>  ({
	type: "INIT",
	width,
	sum,
	initBoxLeft
});

export const mouseMove = (clientX) =>  ({
	type: "MOUSE_MOVE",
	clientX
});

export const animationEnd = () =>  ({
	type: "ANIMATION_END"
});

export const clickButton = (button) =>  ({
	type: "CLICK_BUTTON",
	button
});




